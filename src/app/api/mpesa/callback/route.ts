import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface CallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "M-Pesa Callback endpoint is working",
    method: "GET",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Handle ngrok warning page bypass
    const ngrokSkipWarning = request.headers.get("ngrok-skip-browser-warning");
    if (!ngrokSkipWarning) {
      console.log("Request received without ngrok-skip-browser-warning header");
    }

    const body: CallbackBody = await request.json();
    const { stkCallback } = body.Body;

    console.log("M-Pesa Callback received:", {
      merchantRequestID: stkCallback.MerchantRequestID,
      checkoutRequestID: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
    });

    const supabase = createAdminClient();

    // Find the payment record
    const { data: payment, error: findError } = await supabase
      .from("payments")
      .select("*")
      .eq("transaction_id", stkCallback.CheckoutRequestID)
      .single();

    if (findError || !payment) {
      console.error("Payment not found:", findError);
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    // Determine payment status based on result code
    let newStatus: "success" | "failed" = "failed";
    let metadata = { ...payment.metadata };

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      newStatus = "success";

      // Extract additional details from callback metadata if available
      if (stkCallback.CallbackMetadata?.Item) {
        const callbackData: Record<string, any> = {};
        stkCallback.CallbackMetadata.Item.forEach((item) => {
          callbackData[item.Name] = item.Value;
        });
        metadata.callback_data = callbackData;
      }
    } else {
      // Payment failed
      metadata.failure_reason = stkCallback.ResultDesc;
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: newStatus,
        metadata: metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update payment" },
        { status: 500 }
      );
    }

    // If payment was successful and there's an associated order, update order status
    if (newStatus === "success" && payment.order_id) {
      const { error: orderUpdateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.order_id);

      if (orderUpdateError) {
        console.error("Failed to update order status:", orderUpdateError);
        // Don't fail the callback, payment was recorded successfully
      }
    }

    console.log(`Payment ${payment.id} updated to status: ${newStatus}`);

    return NextResponse.json({
      success: true,
      message: `Payment ${newStatus}`,
    });
  } catch (error) {
    console.error("M-Pesa Callback error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
