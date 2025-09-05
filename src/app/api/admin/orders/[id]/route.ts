import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { emailService } from "@/lib/email-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { id } = await params;

    const { data, error } = await supabase
      .from("orders")
      .select("*, users(name, email)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Order fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch order", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const updateData = await request.json();
    const { id } = await params;

    // Get the current order to check if status is changing
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("*, users(name, email)")
      .eq("id", id)
      .single();

    // Check if order_status column exists by trying to update it separately
    let updateResult;
    if (updateData.order_status) {
      console.log(
        "Updating order_status to:",
        updateData.order_status,
        "for order:",
        id
      );

      // Try to update order_status first
      const { data: statusData, error: statusError } = await supabase
        .from("orders")
        .update({ order_status: updateData.order_status })
        .eq("id", id)
        .select("*, users(name, email)")
        .single();

      if (statusError) {
        console.error("Order status update error:", statusError);
        console.error("Order ID:", id);
        console.error("Update data:", updateData);
        return NextResponse.json(
          {
            error: "Failed to update order status",
            details: statusError.message,
            orderId: id,
            updateData: updateData,
          },
          { status: 500 }
        );
      }
      updateResult = statusData;
      console.log("Order status updated successfully:", statusData);

      // Handle stock restoration for cancelled orders
      if (
        updateData.order_status === "cancelled" &&
        currentOrder?.order_status !== "cancelled"
      ) {
        try {
          console.log("Order cancelled, restoring stock quantities...");

          for (const item of currentOrder.items) {
            // Get current stock quantity
            const { data: productData, error: fetchError } = await supabase
              .from("products")
              .select("stock_quantity, name")
              .eq("id", item.product_id)
              .single();

            if (fetchError) {
              console.error(
                `Failed to fetch product ${item.product_id}:`,
                fetchError
              );
              continue;
            }

            const currentStock = productData.stock_quantity || 0;
            const restoredStock = currentStock + item.quantity;

            // Restore the stock quantity
            const { error: stockError } = await supabase
              .from("products")
              .update({
                stock_quantity: restoredStock,
              })
              .eq("id", item.product_id);

            if (stockError) {
              console.error(
                `Failed to restore stock for product ${item.product_id}:`,
                stockError
              );
            } else {
              console.log(
                `✅ Restored stock for ${productData.name}: ${currentStock} → ${restoredStock} (+${item.quantity})`
              );
            }
          }
        } catch (stockError) {
          console.error("Error restoring stock quantities:", stockError);
          // Don't fail the order update if stock restoration fails
        }
      }
    }

    // Update other fields if any
    const otherFields = { ...updateData };
    delete otherFields.order_status;

    if (Object.keys(otherFields).length > 0) {
      console.log("Updating other fields:", otherFields, "for order:", id);

      const { data: otherData, error: otherError } = await supabase
        .from("orders")
        .update(otherFields)
        .eq("id", id)
        .select("*, users(name, email)")
        .single();

      if (otherError) {
        console.error("Order other fields update error:", otherError);
        console.error("Order ID:", id);
        console.error("Other fields:", otherFields);
        return NextResponse.json(
          {
            error: "Failed to update order",
            details: otherError.message,
            orderId: id,
            otherFields: otherFields,
          },
          { status: 500 }
        );
      }
      updateResult = otherData;
      console.log("Other fields updated successfully:", otherData);
    }

    const data = updateResult;

    // Send status update email if order status changed
    if (updateData.order_status && currentOrder && data) {
      const oldStatus = currentOrder.order_status || "pending";
      const newStatus = updateData.order_status;

      if (oldStatus !== newStatus) {
        try {
          const customerName = data.users?.name || "Customer";
          const customerEmail = data.users?.email;

          if (customerEmail) {
            await emailService.sendOrderStatusUpdate(
              customerEmail,
              customerName,
              data.id,
              newStatus,
              data.total_price
            );
            console.log("✅ Order status update email sent");
          }
        } catch (emailError) {
          console.error("❌ Failed to send status update email:", emailError);
          // Don't fail the update if email fails
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
