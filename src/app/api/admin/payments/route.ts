import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabase
      .from("payments")
      .select(
        `
        *,
        orders!inner(
          id,
          user_id,
          total_price,
          order_status,
          created_at,
          users!inner(
            name,
            email
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`
        transaction_id.ilike.%${search}%,
        orders.users.name.ilike.%${search}%,
        orders.users.email.ilike.%${search}%,
        metadata->>phone_number.ilike.%${search}%,
        metadata->>mpesa_receipt_number.ilike.%${search}%
      `);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: payments, error } = await query;

    if (error) {
      console.error("Error fetching payments:", error);
      return NextResponse.json(
        { error: "Failed to fetch payments" },
        { status: 500 }
      );
    }

    // Transform the data for easier frontend consumption
    const transformedPayments =
      payments?.map((payment) => ({
        id: payment.id,
        transactionId: payment.transaction_id,
        amount: payment.amount,
        status: payment.status,
        provider: payment.provider,
        currency: payment.currency,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        orderId: payment.order_id,
        orderStatus: payment.orders?.order_status,
        customerName: payment.orders?.users?.name,
        customerEmail: payment.orders?.users?.email,
        phoneNumber: payment.metadata?.phone_number,
        mpesaReceiptNumber: payment.metadata?.mpesa_receipt_number,
        merchantRequestId: payment.metadata?.merchant_request_id,
        resultCode: payment.metadata?.result_code,
        resultDescription: payment.metadata?.result_description,
        failureReason: payment.metadata?.failure_reason,
        callbackTimestamp: payment.metadata?.callback_timestamp,
      })) || [];

    return NextResponse.json({
      payments: transformedPayments,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin payments fetch error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
