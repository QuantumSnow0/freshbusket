import { createAdminClient } from "@/lib/supabase/admin";
import { Order } from "@/types";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function createOrderConfirmationEmail(
  order: Order,
  customerName: string
): EmailTemplate {
  const orderItems = order.items
    .map(
      (item) =>
        `<li>${item.product_name} - Qty: ${
          item.quantity
        } × KES ${item.product_price.toFixed(2)}</li>`
    )
    .join("");

  return {
    subject: `Order Confirmation - #${order.id.slice(-8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">FreshBasket</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Order Confirmation</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Thank you for your order, ${customerName}!</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Order Details</h3>
            <p><strong>Order Number:</strong> #${order.id.slice(-8)}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.created_at
            ).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> KES ${order.total_price.toFixed(
              2
            )}</p>
            <p><strong>Payment Status:</strong> ${
              order.payment_status.charAt(0).toUpperCase() +
              order.payment_status.slice(1)
            }</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Order Items</h3>
            <ul style="list-style: none; padding: 0;">
              ${orderItems}
            </ul>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Delivery Address</h3>
            <p>${order.delivery_address}</p>
            ${
              order.customer_mobile
                ? `<p><strong>Mobile:</strong> ${order.customer_mobile}</p>`
                : ""
            }
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Orders
            </a>
          </div>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
          <p style="margin: 0; font-size: 14px;">© 2024 FreshBasket. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      FreshBasket - Order Confirmation
      
      Thank you for your order, ${customerName}!
      
      Order Details:
      - Order Number: #${order.id.slice(-8)}
      - Order Date: ${new Date(order.created_at).toLocaleDateString()}
      - Total Amount: KES ${order.total_price.toFixed(2)}
      - Payment Status: ${
        order.payment_status.charAt(0).toUpperCase() +
        order.payment_status.slice(1)
      }
      
      Order Items:
      ${order.items
        .map(
          (item) =>
            `- ${item.product_name} - Qty: ${
              item.quantity
            } × KES ${item.product_price.toFixed(2)}`
        )
        .join("\n")}
      
      Delivery Address:
      ${order.delivery_address}
      ${order.customer_mobile ? `Mobile: ${order.customer_mobile}` : ""}
      
      View your orders: ${process.env.NEXT_PUBLIC_APP_URL}/orders
      
      © 2024 FreshBasket. All rights reserved.
    `,
  };
}

export function createOrderStatusUpdateEmail(
  order: Order,
  customerName: string,
  oldStatus: string,
  newStatus: string
): EmailTemplate {
  const statusMessages = {
    pending: "Your order is being prepared",
    processed: "Your order has been processed and is ready for shipping",
    shipped: "Your order has been shipped and is on its way",
    delivered: "Your order has been delivered successfully",
    cancelled: "Your order has been cancelled",
  };

  return {
    subject: `Order Update - #${order.id.slice(-8)} - ${
      newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">FreshBasket</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Order Status Update</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Order Status Update</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p>Hello ${customerName},</p>
            <p>Your order #${order.id.slice(-8)} status has been updated:</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px;">
              <p style="margin: 0; font-weight: bold; color: #0c4a6e;">
                ${
                  statusMessages[newStatus as keyof typeof statusMessages] ||
                  "Your order status has been updated"
                }
              </p>
            </div>
            
            <p><strong>Previous Status:</strong> ${
              oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)
            }</p>
            <p><strong>New Status:</strong> ${
              newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
            }</p>
            <p><strong>Total Amount:</strong> KES ${order.total_price.toFixed(
              2
            )}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Orders
            </a>
          </div>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
          <p style="margin: 0; font-size: 14px;">© 2024 FreshBasket. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      FreshBasket - Order Status Update
      
      Hello ${customerName},
      
      Your order #${order.id.slice(-8)} status has been updated:
      
      ${
        statusMessages[newStatus as keyof typeof statusMessages] ||
        "Your order status has been updated"
      }
      
      Previous Status: ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}
      New Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
      Total Amount: KES ${order.total_price.toFixed(2)}
      
      View your orders: ${process.env.NEXT_PUBLIC_APP_URL}/orders
      
      © 2024 FreshBasket. All rights reserved.
    `,
  };
}

export async function sendEmail(
  to: string,
  template: EmailTemplate
): Promise<boolean> {
  try {
    // For development, we'll just log the email content
    // In production, you would integrate with a real email service like SendGrid, Resend, or Nodemailer
    console.log("📧 Email would be sent:");
    console.log("To:", to);
    console.log("Subject:", template.subject);
    console.log("HTML Content:", template.html);
    console.log("Text Content:", template.text);

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In development, we'll just return true
    // In production, you would call your email service here
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}
