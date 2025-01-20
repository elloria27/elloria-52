import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Mail, Phone } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  date: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    country?: string;
    region?: string;
  };
  items?: OrderItem[];
  total: number;
  currency: string;
  status: string;
  paymentStatus?: string;
  shippingMethod?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

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
    try {
      const storedOrders = localStorage.getItem("orders");
      console.log("Raw stored orders:", storedOrders);
      
      if (!storedOrders) {
        console.log("No orders found in localStorage");
        setOrders([]);
        return;
      }

      let parsedOrders;
      try {
        parsedOrders = JSON.parse(storedOrders);
        console.log("Successfully parsed orders:", parsedOrders);
      } catch (parseError) {
        console.error("Error parsing orders:", parseError);
        setOrders([]);
        return;
      }
      
      if (!Array.isArray(parsedOrders)) {
        console.error("Stored orders is not an array:", parsedOrders);
        setOrders([]);
        return;
      }
      
      const ordersWithDefaults = parsedOrders.map((order: Order) => ({
        orderId: order.orderId || Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: order.date || new Date().toISOString(),
        customerDetails: {
          firstName: order.customerDetails?.firstName || '',
          lastName: order.customerDetails?.lastName || '',
          email: order.customerDetails?.email || '',
          phone: order.customerDetails?.phone || '',
          address: order.customerDetails?.address || '',
          country: order.customerDetails?.country || '',
          region: order.customerDetails?.region || ''
        },
        items: order.items || [],
        total: order.total || 0,
        currency: order.currency || 'CAD',
        status: order.status || "Processing",
        paymentStatus: order.paymentStatus || "Paid"
      }));
      
      console.log("Processed orders with defaults:", ordersWithDefaults);
      setOrders(ordersWithDefaults);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Error loading orders");
      setOrders([]);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customerDetails.firstName} ${order.customerDetails.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();

    const orderDate = new Date(order.date);
    const now = new Date();
    let matchesDate = true;

    switch (dateRange) {
      case "today":
        matchesDate = orderDate.toDateString() === now.toDateString();
        break;
      case "week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = orderDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = orderDate >= monthAgo;
        break;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <Button onClick={() => {}} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Orders
          </Button>
        </div>

        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-white border border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] bg-white border border-gray-200">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

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
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow 
                      key={order.orderId}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {order.customerDetails.firstName} {order.customerDetails.lastName}
                      </TableCell>
                      <TableCell>
                        {order.currency} {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.paymentStatus || "")}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => updateOrderStatus(order.orderId, value)}
                        >
                          <SelectTrigger className="w-[180px] bg-white border border-gray-200">
                            <SelectValue placeholder="Update status" />
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
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>{selectedOrder.customerDetails.firstName} {selectedOrder.customerDetails.lastName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </h3>
                      <p>{selectedOrder.customerDetails.email}</p>
                    </div>
                    {selectedOrder.customerDetails.phone && (
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Phone
                        </h3>
                        <p>{selectedOrder.customerDetails.phone}</p>
                      </div>
                    )}
                    {selectedOrder.customerDetails.address && (
                      <div>
                        <h3 className="font-semibold">Shipping Address</h3>
                        <p>{selectedOrder.customerDetails.address}</p>
                        <p>{selectedOrder.customerDetails.region}, {selectedOrder.customerDetails.country}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">Payment Status</h3>
                      <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus || "")}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    {selectedOrder.shippingMethod && (
                      <div>
                        <h3 className="font-semibold">Shipping Method</h3>
                        <p>{selectedOrder.shippingMethod}</p>
                      </div>
                    )}
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