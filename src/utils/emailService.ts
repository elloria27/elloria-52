import { supabase } from "@/integrations/supabase/client";

interface OrderEmailDetails {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
}

export const sendOrderEmails = async (orderDetails: OrderEmailDetails) => {
  console.log("Starting email sending process with details:", orderDetails);

  const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: right; color: #666;">
        <p>Order #${orderDetails.orderId}</p>
        <p>${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin: 30px 0;">
        <p>Dear ${orderDetails.customerName},</p>
        
        <p>Thank you for choosing Elloria. We are writing to confirm that we have received your order and are delighted to process it for you.</p>
        
        <p>Below are the details of your purchase:</p>
        
        <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 15px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #ddd;">
                <th style="text-align: left; padding: 8px;">Item</th>
                <th style="text-align: center; padding: 8px;">Quantity</th>
                <th style="text-align: right; padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
                <td style="text-align: right; padding: 8px; font-weight: bold;">$${orderDetails.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Shipping Address:</h3>
          <p style="margin: 10px 0;">
            ${orderDetails.shippingAddress.address}<br>
            ${orderDetails.shippingAddress.region}<br>
            ${orderDetails.shippingAddress.country}
          </p>
        </div>

        <p>We will process your order promptly and notify you once it has been shipped. If you have any questions about your order, please don't hesitate to contact our customer service team.</p>

        <p>Best regards,<br>The Elloria Team</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>This is an automated message, please do not reply to this email. For any inquiries, please contact us at support@elloria.ca</p>
      </div>
    </div>
  `;

  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>New Order Received - #${orderDetails.orderId}</h2>
      
      <div style="margin: 20px 0;">
        <h3>Customer Details:</h3>
        <p>Name: ${orderDetails.customerName}</p>
        <p>Email: ${orderDetails.customerEmail}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${orderDetails.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2" style="text-align: right; font-weight: bold;">Total:</td>
            <td style="text-align: right; font-weight: bold;">$${orderDetails.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 20px 0;">
        <h3>Shipping Address:</h3>
        <p>
          ${orderDetails.shippingAddress.address}<br>
          ${orderDetails.shippingAddress.region}<br>
          ${orderDetails.shippingAddress.country}
        </p>
      </div>
    </div>
  `;

  try {
    // Send customer confirmation email
    const { data: customerEmailData, error: customerEmailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: [orderDetails.customerEmail],
        subject: `Order Confirmation - #${orderDetails.orderId}`,
        html: customerEmailHtml,
      },
    });

    if (customerEmailError) {
      console.error('Error sending customer confirmation email:', customerEmailError);
      throw new Error('Failed to send customer confirmation email');
    }

    console.log('Customer confirmation email sent successfully:', customerEmailData);

    // Send admin notification email
    const { data: adminEmailData, error: adminEmailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: ['admin@elloria.ca'],
        subject: `New Order Received - #${orderDetails.orderId}`,
        html: adminEmailHtml,
      },
    });

    if (adminEmailError) {
      console.error('Error sending admin notification email:', adminEmailError);
      throw new Error('Failed to send admin notification email');
    }

    console.log('Admin notification email sent successfully:', adminEmailData);

  } catch (error) {
    console.error('Error in sendOrderEmails:', error);
    throw error;
  }
};