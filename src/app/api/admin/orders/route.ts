import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // First, try to get orders with user data
    const { data: ordersWithUsers, error: joinError } = await supabase
      .from("orders")
      .select(
        `
        *,
        users(name, email)
      `
      )
      .order("created_at", { ascending: false });

    if (joinError) {
      console.warn("Join query failed, trying without join:", joinError);

      // If join fails, get orders without user data
      const { data: ordersOnly, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders query error:", ordersError);
        return NextResponse.json(
          { error: `Failed to fetch orders: ${ordersError.message}` },
          { status: 500 }
        );
      }

      // Transform orders to include empty user data
      const transformedOrders = (ordersOnly || []).map((order) => ({
        ...order,
        users: {
          name: "Unknown User",
          email: "No email available",
        },
      }));

      return NextResponse.json({ orders: transformedOrders });
    }

    return NextResponse.json({ orders: ordersWithUsers || [] });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}


