import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Printer, ShoppingBag, UserCircle, FileText } from "lucide-react";
import { Logo } from "@/components/header/Logo";

interface OrderDetails {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  taxes: {
    gst: number;
    pst: number;
    hst: number;
  };
  shipping: {
    name: string;
    price: number;
  };
  total: number;
  currency: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    region: string;
  };
  date: string;
}

const STORE_DETAILS = {
  name: "ELLORIA",
  address: "123 Fashion Avenue",
  city: "New York, NY 10001",
  country: "United States",
  phone: "+1 (555) 123-4567",
  email: "support@elloria.com",
  taxId: "TAX-123456789"
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    setIsLoggedIn(!!currentUser);

    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrderDetails(parsedOrder);
    }
  }, []);

  const handlePrint = () => {
    if (!orderDetails) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${orderDetails.orderId}</title>
          <style>
            @page { margin: 2cm; }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: left;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .invoice-details {
              margin-bottom: 30px;
            }
            .customer-info {
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            .totals {
              text-align: right;
            }
            .total-row {
              margin: 5px 0;
            }
            .final-total {
              font-weight: bold;
              font-size: 1.2em;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${STORE_DETAILS.name}</div>
            <div>Invoice #${orderDetails.orderId}</div>
            <div>Date: ${new Date(orderDetails.date).toLocaleDateString()}</div>
          </div>

          <div class="customer-info">
            <h3>Customer Information</h3>
            <div>${orderDetails.customerDetails.firstName} ${orderDetails.customerDetails.lastName}</div>
            <div>${orderDetails.customerDetails.address}</div>
            <div>${orderDetails.customerDetails.region}</div>
            <div>${orderDetails.customerDetails.country}</div>
            <div>Phone: ${orderDetails.customerDetails.phone}</div>
            <div>Email: ${orderDetails.customerDetails.email}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${orderDetails.currency} ${item.price.toFixed(2)}</td>
                  <td>${orderDetails.currency} ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">Subtotal: ${orderDetails.currency} ${orderDetails.subtotal.toFixed(2)}</div>
            ${orderDetails.taxes.gst > 0 ? `
              <div class="total-row">GST (${orderDetails.taxes.gst}%): ${orderDetails.currency} ${(orderDetails.subtotal * orderDetails.taxes.gst / 100).toFixed(2)}</div>
            ` : ''}
            ${orderDetails.taxes.pst > 0 ? `
              <div class="total-row">PST (${orderDetails.taxes.pst}%): ${orderDetails.currency} ${(orderDetails.subtotal * orderDetails.taxes.pst / 100).toFixed(2)}</div>
            ` : ''}
            ${orderDetails.taxes.hst > 0 ? `
              <div class="total-row">HST (${orderDetails.taxes.hst}%): ${orderDetails.currency} ${(orderDetails.subtotal * orderDetails.taxes.hst / 100).toFixed(2)}</div>
            ` : ''}
            <div class="total-row">Shipping (${orderDetails.shipping.name}): ${orderDetails.currency} ${orderDetails.shipping.price.toFixed(2)}</div>
            <div class="final-total">Total: ${orderDetails.currency} ${orderDetails.total.toFixed(2)}</div>
          </div>
        </body>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (!orderDetails) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No order details found</h1>
        <Button onClick={() => navigate("/")} variant="secondary">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Order Confirmation</h1>
          <p className="text-lg text-gray-600">Order #{orderDetails.orderId}</p>
          <p className="text-lg text-gray-600 mt-2">
            Status: <span className="font-semibold text-orange-500">Processing</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Store Information</h3>
            <div className="space-y-2 text-sm">
              <p>{STORE_DETAILS.name}</p>
              <p>{STORE_DETAILS.address}</p>
              <p>{STORE_DETAILS.city}</p>
              <p>{STORE_DETAILS.country}</p>
              <p>Phone: {STORE_DETAILS.phone}</p>
              <p>Email: {STORE_DETAILS.email}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p>{orderDetails.customerDetails.firstName} {orderDetails.customerDetails.lastName}</p>
              <p>{orderDetails.customerDetails.address}</p>
              <p>{orderDetails.customerDetails.region}</p>
              <p>{orderDetails.customerDetails.country}</p>
              <p>Phone: {orderDetails.customerDetails.phone}</p>
              <p>Email: {orderDetails.customerDetails.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-primary">
                  {orderDetails.currency} {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{orderDetails.currency} {orderDetails.subtotal.toFixed(2)}</span>
          </div>

          {orderDetails.taxes.gst > 0 && (
            <div className="flex justify-between text-sm">
              <span>GST ({orderDetails.taxes.gst}%)</span>
              <span>
                {orderDetails.currency} {(orderDetails.subtotal * orderDetails.taxes.gst / 100).toFixed(2)}
              </span>
            </div>
          )}

          {orderDetails.taxes.pst > 0 && (
            <div className="flex justify-between text-sm">
              <span>PST ({orderDetails.taxes.pst}%)</span>
              <span>
                {orderDetails.currency} {(orderDetails.subtotal * orderDetails.taxes.pst / 100).toFixed(2)}
              </span>
            </div>
          )}

          {orderDetails.taxes.hst > 0 && (
            <div className="flex justify-between text-sm">
              <span>HST ({orderDetails.taxes.hst}%)</span>
              <span>
                {orderDetails.currency} {(orderDetails.subtotal * orderDetails.taxes.hst / 100).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Shipping ({orderDetails.shipping.name})</span>
            <span>{orderDetails.currency} {orderDetails.shipping.price.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-medium text-lg pt-4 border-t mt-4">
            <span>Total</span>
            <span>{orderDetails.currency} {orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Print Invoice
        </Button>
        
        {isLoggedIn ? (
          <Button onClick={() => navigate("/account")} variant="default" className="gap-2">
            <FileText className="w-4 h-4" />
            View My Purchases
          </Button>
        ) : (
          <Button onClick={() => navigate("/login")} variant="default" className="gap-2">
            <UserCircle className="w-4 h-4" />
            Sign In
          </Button>
        )}

        <Button onClick={() => navigate("/")} variant="secondary" className="gap-2">
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;