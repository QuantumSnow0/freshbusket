// Real email service using Nodemailer with Gmail
import nodemailer from "nodemailer";

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class RealEmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      // Gmail SMTP configuration
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
        },
      });

      console.log("✅ Email transporter initialized");
    } catch (error) {
      console.error("❌ Failed to initialize email transporter:", error);
      this.transporter = null;
    }
  }

  public async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // If no transporter, fall back to console logging
      if (!this.transporter) {
        console.log("📧 Email would be sent (no transporter configured):");
        console.log("To:", data.to);
        console.log("Subject:", data.subject);
        console.log("HTML Content:", data.html);
        console.log("Text Content:", data.text);
        return true;
      }

      // Send real email
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });

      console.log("✅ Email sent successfully:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      return false;
    }
  }

  // Method to send order confirmation emails
  public async sendOrderConfirmation(
    customerEmail: string,
    customerName: string,
    orderId: string,
    orderTotal: number,
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
    }>
  ): Promise<boolean> {
    const subject = `Order Confirmation - FreshBasket #${orderId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">FreshBasket</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Your Online Grocery Store</p>
        </div>
        
        <h2 style="color: #16a34a; margin-bottom: 20px;">Order Confirmed! 🎉</h2>
        <p>Hello ${customerName},</p>
        <p>Thank you for your order! We've received your order and will start preparing it soon.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Total:</strong> KES ${orderTotal}</p>
          <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Confirmed</span></p>
        </div>
        
        <h3 style="color: #374151;">Items Ordered:</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderItems
            .map(
              (item) => `
                <li style="background-color: #f9fafb; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #16a34a;">
                  <strong>${item.name}</strong> x${item.quantity} - KES ${
                item.price * item.quantity
              }
                </li>
              `
            )
            .join("")}
        </ul>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #065f46;"><strong>What's next?</strong></p>
          <p style="margin: 5px 0 0 0; color: #065f46;">We'll send you another email when your order is ready for delivery.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0;">Thank you for choosing FreshBasket!</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">© 2024 FreshBasket. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
      FreshBasket - Order Confirmation
      
      Hello ${customerName},
      
      Thank you for your order! We've received your order and will start preparing it soon.
      
      Order Details:
      Order ID: #${orderId}
      Total: KES ${orderTotal}
      Status: Confirmed
      
      Items Ordered:
      ${orderItems
        .map(
          (item) =>
            `${item.name} x${item.quantity} - KES ${item.price * item.quantity}`
        )
        .join("\n")}
      
      What's next?
      We'll send you another email when your order is ready for delivery.
      
      Thank you for choosing FreshBasket!
      © 2024 FreshBasket. All rights reserved.
    `;

    return this.sendEmail({
      to: customerEmail,
      subject,
      html,
      text,
    });
  }

  // Method to send order status update emails
  public async sendOrderStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderId: string,
    newStatus: string,
    orderTotal: number
  ): Promise<boolean> {
    const statusMessages = {
      processed: "Your order is being prepared",
      shipped: "Your order is on its way",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    const statusEmojis = {
      processed: "👨‍🍳",
      shipped: "🚚",
      delivered: "✅",
      cancelled: "❌",
    };

    const statusMessage =
      statusMessages[newStatus as keyof typeof statusMessages] ||
      `Your order status has been updated to: ${newStatus}`;

    const statusEmoji =
      statusEmojis[newStatus as keyof typeof statusEmojis] || "📦";

    const subject = `Order Update - FreshBasket #${orderId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">FreshBasket</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Your Online Grocery Store</p>
        </div>
        
        <h2 style="color: #16a34a; margin-bottom: 20px;">Order Update ${statusEmoji}</h2>
        <p>Hello ${customerName},</p>
        <p>${statusMessage}.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">${
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
          }</span></p>
          <p><strong>Total:</strong> KES ${orderTotal}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0;">Thank you for choosing FreshBasket!</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">© 2024 FreshBasket. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
      FreshBasket - Order Update
      
      Hello ${customerName},
      
      ${statusMessage}.
      
      Order Details:
      Order ID: #${orderId}
      Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
      Total: KES ${orderTotal}
      
      Thank you for choosing FreshBasket!
      © 2024 FreshBasket. All rights reserved.
    `;

    return this.sendEmail({
      to: customerEmail,
      subject,
      html,
      text,
    });
  }

  // Method to send admin notification emails for new orders
  public async sendAdminOrderNotification(
    adminEmail: string,
    customerName: string,
    customerEmail: string,
    customerMobile: string,
    orderId: string,
    orderTotal: number,
    deliveryAddress: string,
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
    }>
  ): Promise<boolean> {
    const subject = `🛒 New Order Received - FreshBasket #${orderId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">FreshBasket Admin</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">New Order Notification</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h2 style="color: #92400e; margin: 0;">🛒 New Order Received!</h2>
          <p style="color: #92400e; margin: 5px 0 0 0;">A customer has just placed an order and needs your attention.</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Total Amount:</strong> <span style="color: #16a34a; font-weight: bold; font-size: 18px;">KES ${orderTotal}</span></p>
          <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending</span></p>
          <p><strong>Order Time:</strong> ${new Date().toLocaleString("en-KE", {
            timeZone: "Africa/Nairobi",
          })}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Customer Information:</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Mobile:</strong> ${customerMobile}</p>
          <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
        </div>
        
        <h3 style="color: #374151;">Items Ordered:</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderItems
            .map(
              (item) => `
                <li style="background-color: #f9fafb; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #16a34a;">
                  <strong>${item.name}</strong> x${item.quantity} - KES ${
                item.price * item.quantity
              }
                </li>
              `
            )
            .join("")}
        </ul>
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af;"><strong>Action Required:</strong></p>
          <p style="margin: 5px 0 0 0; color: #1e40af;">Please log into your admin dashboard to process this order and update its status.</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="${
            process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
          }/admin/orders" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Order in Admin Dashboard
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0;">FreshBasket Admin Panel</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">© 2024 FreshBasket. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
      FreshBasket Admin - New Order Notification
      
      🛒 New Order Received!
      A customer has just placed an order and needs your attention.
      
      Order Details:
      Order ID: #${orderId}
      Total Amount: KES ${orderTotal}
      Status: Pending
      Order Time: ${new Date().toLocaleString("en-KE", {
        timeZone: "Africa/Nairobi",
      })}
      
      Customer Information:
      Name: ${customerName}
      Email: ${customerEmail}
      Mobile: ${customerMobile}
      Delivery Address: ${deliveryAddress}
      
      Items Ordered:
      ${orderItems
        .map(
          (item) =>
            `${item.name} x${item.quantity} - KES ${item.price * item.quantity}`
        )
        .join("\n")}
      
      Action Required:
      Please log into your admin dashboard to process this order and update its status.
      
      Admin Dashboard: ${
        process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
      }/admin/orders
      
      FreshBasket Admin Panel
      © 2024 FreshBasket. All rights reserved.
    `;

    return this.sendEmail({
      to: adminEmail,
      subject,
      html,
      text,
    });
  }
}

// Export singleton instance
export const realEmailService = new RealEmailService();
