import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

interface ShippingAddress {
  address: string;
  region: string;
  country: string;
}

interface EmailData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
}

export const sendOrderEmails = async (emailData: EmailData) => {
  console.log("Sending order confirmation emails...");
  
  try {
    // Send customer confirmation
    const { data: customerEmailData, error: customerError } = await supabase.functions.invoke('send-email', {
      body: {
        to: [emailData.customerEmail],
        subject: `Order Confirmation #${emailData.orderId}`,
        html: generateCustomerEmailHtml(emailData),
        from: "Elloria <orders@elloria.com>"
      }
    });

    if (customerError) {
      console.error("Error sending customer confirmation:", customerError);
      throw new Error("Failed to send customer confirmation email");
    }

    console.log("Customer confirmation email sent successfully:", customerEmailData);

    // Send admin notification
    const { data: adminEmailData, error: adminError } = await supabase.functions.invoke('send-email', {
      body: {
        to: ["admin@elloria.com"],
        subject: `New Order #${emailData.orderId}`,
        html: generateAdminEmailHtml(emailData),
        from: "Elloria System <system@elloria.com>"
      }
    });

    if (adminError) {
      console.error("Error sending admin notification:", adminError);
      // Don't throw here as customer email was sent successfully
      return;
    }

    console.log("Admin notification email sent successfully:", adminEmailData);

  } catch (error) {
    console.error("Error in sendOrderEmails:", error);
    throw error;
  }
};

const generateCustomerEmailHtml = (data: EmailData) => {
  const itemsList = data.items
    .map(item => `
      <tr>
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px;">${item.quantity}</td>
        <td style="padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `)
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
      <p>Dear ${data.customerName},</p>
      <p>Thank you for your order! Here are your order details:</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
        <h2>Order #${data.orderId}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid #ddd;">
              <td colspan="2" style="padding: 10px;"><strong>Total</strong></td>
              <td style="padding: 10px;"><strong>$${data.total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <h3>Shipping Address:</h3>
        <p>
          ${data.shippingAddress.address}<br>
          ${data.shippingAddress.region}<br>
          ${data.shippingAddress.country}
        </p>
      </div>

      <p style="margin-top: 20px;">
        We'll notify you when your order ships. If you have any questions, please don't hesitate to contact us.
      </p>

      <div style="margin-top: 30px; text-align: center; color: #666;">
        <p>Thank you for shopping with Elloria!</p>
      </div>
    </div>
  `;
};

const generateAdminEmailHtml = (data: EmailData) => {
  const itemsList = data.items
    .map(item => `
      <tr>
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px;">${item.quantity}</td>
        <td style="padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `)
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">New Order Received</h1>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
        <h2>Order #${data.orderId}</h2>
        
        <h3>Customer Information:</h3>
        <p>
          Name: ${data.customerName}<br>
          Email: ${data.customerEmail}
        </p>

        <h3>Shipping Address:</h3>
        <p>
          ${data.shippingAddress.address}<br>
          ${data.shippingAddress.region}<br>
          ${data.shippingAddress.country}
        </p>

        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid #ddd;">
              <td colspan="2" style="padding: 10px;"><strong>Total</strong></td>
              <td style="padding: 10px;"><strong>$${data.total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
};