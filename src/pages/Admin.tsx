import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Order {
  orderId: string;
  date: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
  total: number;
  currency: string;
  status?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/admin/login");
      return;
    }

    const user = JSON.parse(currentUser);
    if (user.role !== "admin") {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }

    setIsAuthorized(true);
    loadOrders();
  }, [navigate]);

  const loadOrders = () => {
    console.log("Loading orders from localStorage");
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      const ordersWithStatus = parsedOrders.map((order: Order) => ({
        ...order,
        status: order.status || "Processing"
      }));
      setOrders(ordersWithStatus);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} status to ${newStatus}`);
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.customerDetails.firstName} {order.customerDetails.lastName}
                  </TableCell>
                  <TableCell>{order.customerDetails.email}</TableCell>
                  <TableCell>
                    {order.currency} {order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => updateOrderStatus(order.orderId, value)}
                    >
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;