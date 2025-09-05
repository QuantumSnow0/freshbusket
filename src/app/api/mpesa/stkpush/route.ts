import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MpesaSTKPushRequest, MpesaSTKPushResponse } from "@/types";

// M-Pesa API configuration
const MPESA_BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

const BUSINESS_SHORTCODE = process.env.MPESA_SHORTCODE || "174379";
// For sandbox testing, use a public callback URL or ngrok
const CALLBACK_URL =
  process.env.MPESA_ENV === "production"
    ? `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
      }/api/mpesa/callback`
    : process.env.MPESA_CALLBACK_URL ||
      "https://freshbusket.vercel.app/api/mpesa/callback";

// Debug: Log the callback URL being used
console.log("Using callback URL:", CALLBACK_URL);

interface AccessTokenResponse {
  access_token: string;
  expires_in: string;
}

interface STKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa credentials not configured");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data: AccessTokenResponse = await response.json();
  return data.access_token;
}

function generatePassword(): { password: string; timestamp: string } {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  const passkey = process.env.MPESA_PASSKEY;

  if (!passkey) {
    throw new Error("M-Pesa passkey not configured");
  }

  const password = Buffer.from(
    `${BUSINESS_SHORTCODE}${passkey}${timestamp}`
  ).toString("base64");

  return { password, timestamp };
}

export async function POST(request: NextRequest) {
  try {
    const body: MpesaSTKPushRequest = await request.json();
    const { phone_number, amount, order_id } = body;

    // Validate input
    if (!phone_number || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Phone number and amount are required" },
        { status: 400 }
      );
    }

    // Validate phone number format (Kenyan format)
    const cleanPhone = phone_number.replace(/\D/g, "");
    if (!cleanPhone.startsWith("254") && !cleanPhone.startsWith("0")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid phone number format. Use +254XXXXXXXXX or 0XXXXXXXXX",
        },
        { status: 400 }
      );
    }

    // Format phone number for M-Pesa (254XXXXXXXXX)
    const formattedPhone = cleanPhone.startsWith("0")
      ? `254${cleanPhone.slice(1)}`
      : cleanPhone;

    // Get user from session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Generate password and timestamp
    const { password, timestamp } = generatePassword();

    // Prepare STK Push request
    const stkPushRequest: STKPushRequest = {
      BusinessShortCode: BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount), // M-Pesa expects integer amount
      PartyA: formattedPhone,
      PartyB: BUSINESS_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: order_id || `ORDER_${Date.now()}`,
      TransactionDesc: `FreshBasket Payment - ${order_id || "Order"}`,
    };

    // Debug logging
    console.log("STK Push Request:", {
      callbackURL: CALLBACK_URL,
      businessShortCode: BUSINESS_SHORTCODE,
      phoneNumber: formattedPhone,
      amount: Math.round(amount),
    });

    // Send STK Push request
    const stkResponse = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushRequest),
      }
    );

    if (!stkResponse.ok) {
      const errorText = await stkResponse.text();
      console.error("STK Push failed:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to initiate M-Pesa payment" },
        { status: 500 }
      );
    }

    const stkData: STKPushResponse = await stkResponse.json();

    if (stkData.ResponseCode !== "0") {
      return NextResponse.json(
        {
          success: false,
          error:
            stkData.ResponseDescription || "M-Pesa payment initiation failed",
        },
        { status: 400 }
      );
    }

    // Save payment record to database
    const adminSupabase = createAdminClient();
    const { data: payment, error: paymentError } = await adminSupabase
      .from("payments")
      .insert({
        user_id: user.id,
        order_id: order_id || null,
        provider: "mpesa",
        amount: amount,
        currency: "KES",
        status: "pending",
        transaction_id: stkData.CheckoutRequestID,
        external_id: stkData.MerchantRequestID,
        phone_number: formattedPhone,
        metadata: {
          business_shortcode: BUSINESS_SHORTCODE,
          account_reference: stkPushRequest.AccountReference,
          transaction_desc: stkPushRequest.TransactionDesc,
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Failed to save payment record:", paymentError);
      // Don't fail the request, payment was initiated successfully
    }

    const response: MpesaSTKPushResponse = {
      success: true,
      message: stkData.CustomerMessage || "Payment request sent to your phone",
      checkout_request_id: stkData.CheckoutRequestID,
      merchant_request_id: stkData.MerchantRequestID,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
