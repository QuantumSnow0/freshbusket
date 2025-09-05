// Email service for FreshBasket
// This is a simple email service that can be easily replaced with a real email provider

import { realEmailService } from "./real-email-service";

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // Check if real email service is configured
      if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
        // Use real email service
        return await realEmailService.sendEmail(data);
      }

      // Fallback to console logging in development
      console.log("📧 Email would be sent (no email credentials configured):");
      console.log("To:", data.to);
      console.log("Subject:", data.subject);
      console.log("HTML Content:", data.html);
      console.log("Text Content:", data.text);

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("Email sending error:", error);
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
    // Check if real email service is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      return await realEmailService.sendOrderConfirmation(
        customerEmail,
        customerName,
        orderId,
        orderTotal,
        orderItems
      );
    }

    // Fallback to basic email
    const subject = `Order Confirmation - FreshBasket #${orderId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Order Confirmed!</h2>
        <p>Hello ${customerName},</p>
        <p>Thank you for your order! We've received your order and will start preparing it soon.</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Total:</strong> KES ${orderTotal}</p>
        
        <h3>Items Ordered:</h3>
        <ul>
          ${orderItems
            .map(
              (item) =>
                `<li>${item.name} x${item.quantity} - KES ${
                  item.price * item.quantity
                }</li>`
            )
            .join("")}
        </ul>
        
        <p>We'll send you another email when your order is ready for delivery.</p>
        <p>Thank you for choosing FreshBasket!</p>
      </div>
    `;

    const text = `
      Order Confirmation - FreshBasket #${orderId}
      
      Hello ${customerName},
      
      Thank you for your order! We've received your order and will start preparing it soon.
      
      Order Details:
      Order ID: #${orderId}
      Total: KES ${orderTotal}
      
      Items Ordered:
      ${orderItems
        .map(
          (item) =>
            `${item.name} x${item.quantity} - KES ${item.price * item.quantity}`
        )
        .join("\n")}
      
      We'll send you another email when your order is ready for delivery.
      Thank you for choosing FreshBasket!
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
    // Check if real email service is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      return await realEmailService.sendOrderStatusUpdate(
        customerEmail,
        customerName,
        orderId,
        newStatus,
        orderTotal
      );
    }

    // Fallback to basic email
    const statusMessages = {
      processed: "Your order is being prepared",
      shipped: "Your order is on its way",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    const statusMessage =
      statusMessages[newStatus as keyof typeof statusMessages] ||
      `Your order status has been updated to: ${newStatus}`;

    const subject = `Order Update - FreshBasket #${orderId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Order Update</h2>
        <p>Hello ${customerName},</p>
        <p>${statusMessage}.</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Status:</strong> ${
          newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
        }</p>
        <p><strong>Total:</strong> KES ${orderTotal}</p>
        
        <p>Thank you for choosing FreshBasket!</p>
      </div>
    `;

    const text = `
      Order Update - FreshBasket #${orderId}
      
      Hello ${customerName},
      
      ${statusMessage}.
      
      Order Details:
      Order ID: #${orderId}
      Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
      Total: KES ${orderTotal}
      
      Thank you for choosing FreshBasket!
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
    // Check if real email service is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      return await realEmailService.sendAdminOrderNotification(
        adminEmail,
        customerName,
        customerEmail,
        customerMobile,
        orderId,
        orderTotal,
        deliveryAddress,
        orderItems
      );
    }

    // Fallback to basic email
    const subject = `🛒 New Order Received - FreshBasket #${orderId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">🛒 New Order Received!</h2>
        <p>A customer has just placed an order and needs your attention.</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Total Amount:</strong> KES ${orderTotal}</p>
        <p><strong>Status:</strong> Pending</p>
        
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Mobile:</strong> ${customerMobile}</p>
        <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
        
        <h3>Items Ordered:</h3>
        <ul>
          ${orderItems
            .map(
              (item) =>
                `<li>${item.name} x${item.quantity} - KES ${
                  item.price * item.quantity
                }</li>`
            )
            .join("")}
        </ul>
        
        <p><strong>Action Required:</strong> Please log into your admin dashboard to process this order.</p>
        <p>Admin Dashboard: ${
          process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
        }/admin/orders</p>
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
      
      Action Required: Please log into your admin dashboard to process this order.
      Admin Dashboard: ${
        process.env.NEXT_PUBLIC_SITE_URL || "https://freshbusket.vercel.app"
      }/admin/orders
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
export const emailService = EmailService.getInstance();
