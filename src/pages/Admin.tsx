import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-32">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Orders Overview</TabsTrigger>
            <TabsTrigger value="details">Order Details</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow 
                      key={order.orderId}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleOrderClick(order)}
                    >
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
                        <Badge className={getStatusColor(order.status || "")}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => updateOrderStatus(order.orderId, value)}
                        >
                          <SelectTrigger className="w-[180px] bg-white border border-gray-200">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
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
          </TabsContent>

          <TabsContent value="details">
            {selectedOrder ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Order ID</h3>
                        <p>{selectedOrder.orderId}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Date</h3>
                        <p>{new Date(selectedOrder.date).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Status</h3>
                        <Badge className={getStatusColor(selectedOrder.status || "")}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold">Total</h3>
                        <p>{selectedOrder.currency} {selectedOrder.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Name</h3>
                        <p>{selectedOrder.customerDetails.firstName} {selectedOrder.customerDetails.lastName}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p>{selectedOrder.customerDetails.email}</p>
                      </div>
                      {selectedOrder.shippingAddress && (
                        <div>
                          <h3 className="font-semibold">Shipping Address</h3>
                          <p>{selectedOrder.shippingAddress.street}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedOrder.items && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{selectedOrder.currency} {item.price.toFixed(2)}</TableCell>
                              <TableCell>{selectedOrder.currency} {(item.quantity * item.price).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select an order from the Orders Overview tab to view details
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;