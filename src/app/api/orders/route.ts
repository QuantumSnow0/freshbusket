import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Order } from "@/types";
import { emailService } from "@/lib/email-service";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in public.users table, create if not
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingUser) {
      // Create user record if it doesn't exist using admin client
      const adminSupabase = createAdminClient();
      const { error: userError } = await adminSupabase.from("users").insert([
        {
          id: user.id,
          name: user.user_metadata?.name || "User",
          email: user.email,
          address: "",
        },
      ]);

      if (userError) {
        console.error("Failed to create user record:", userError);
        // Continue anyway, as the order can still be created
      } else {
        console.log("✅ User record created successfully");
      }
    }

    const orderData: Omit<Order, "id" | "created_at" | "updated_at"> =
      await request.json();

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          user_id: user.id,
          order_status: "pending", // Set default order status
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Order creation error:", error);
      return NextResponse.json(
        { error: `Failed to create order: ${error.message}` },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    try {
      const customerName = user.user_metadata?.name || "Customer";
      await emailService.sendOrderConfirmation(
        user.email!,
        customerName,
        data.id,
        data.total_price,
        data.items.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.product_price,
        }))
      );
      console.log("✅ Order confirmation email sent to customer");
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    // Send admin notification email
    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (adminEmail) {
        const customerName = user.user_metadata?.name || "Customer";
        await emailService.sendAdminOrderNotification(
          adminEmail,
          customerName,
          user.email!,
          data.customer_mobile || "Not provided",
          data.id,
          data.total_price,
          data.delivery_address,
          data.items.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.product_price,
          }))
        );
        console.log("✅ Admin notification email sent");
      } else {
        console.log(
          "⚠️ Admin email not configured, skipping admin notification"
        );
      }
    } catch (emailError) {
      console.error("❌ Failed to send admin notification email:", emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
