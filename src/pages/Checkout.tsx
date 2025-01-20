import { Toaster } from "@/components/ui/toaster";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { LoginPrompt } from "@/components/checkout/LoginPrompt";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  CANADIAN_TAX_RATES, 
  US_TAX_RATES, 
  SHIPPING_OPTIONS,
  USD_TO_CAD,
} from "@/utils/locationData";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { ShippingOptions } from "@/components/checkout/ShippingOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { sendOrderEmails } from "@/utils/emailService";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, activePromoCode, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const calculateTaxes = () => {
    if (!region) return { gst: 0, pst: 0, hst: 0 };
    
    const taxRates = country === "CA" 
      ? CANADIAN_TAX_RATES[region] 
      : US_TAX_RATES[region] || { pst: 0 };
    
    return {
      gst: taxRates.gst || 0,
      pst: taxRates.pst || 0,
      hst: taxRates.hst || 0
    };
  };

  const shippingOptions = country ? SHIPPING_OPTIONS[country] : [];
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);

  const taxes = calculateTaxes();
  const subtotalInCurrentCurrency = country === "US" ? subtotal / USD_TO_CAD : subtotal;
  const shippingCost = selectedShippingOption?.price || 0;
  
  const taxAmount = subtotalInCurrentCurrency * (
    (taxes.hst || 0) / 100 +
    (taxes.gst || 0) / 100 +
    (taxes.pst || 0) / 100
  );

  const total = subtotalInCurrentCurrency + taxAmount + shippingCost;
  const currencySymbol = country === "US" ? "$" : "CAD $";

  const updateUserProfile = () => {
    console.log("Updating user profile with checkout information");
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const updatedUser = {
        ...userData,
        firstName: firstName || userData.firstName,
        lastName: lastName || userData.lastName,
        email: email || userData.email,
        phoneNumber: phoneNumber || userData.phoneNumber,
        country: country || userData.country,
        region: region || userData.region,
        address: address || userData.address,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      console.log("User profile updated with new information");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Starting order submission...");

    if (isSubmitting) {
      console.log("Submission already in progress");
      return;
    }

    if (!selectedShipping) {
      toast.error("Please select a shipping method");
      return;
    }

    if (!country || !region) {
      toast.error("Please select your country and region");
      return;
    }
    
    setIsSubmitting(true);
    
    const customerDetails = {
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      address,
      country,
      region
    };

    // Validate required fields
    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || !customerDetails.address) {
      setIsSubmitting(false);
      toast.error("Please fill in all required fields");
      return;
    }
    
    console.log("Customer details:", customerDetails);
    
    const orderDetails = {
      items,
      subtotal: subtotalInCurrentCurrency,
      taxes,
      shipping: selectedShippingOption,
      total,
      currency: country === "US" ? "USD" : "CAD",
      customerDetails
    };

    console.log("Order details:", orderDetails);

    try {
      console.log("Processing order...");
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Update user profile with new information
      updateUserProfile();
      
      // Store order details
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        ...orderDetails,
        orderId,
        date: new Date().toISOString()
      };
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
      
      // Attempt to send confirmation emails
      await sendOrderEmails({
        customerEmail: customerDetails.email,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        orderId,
        items,
        total,
        shippingAddress: {
          address: customerDetails.address,
          region: customerDetails.region,
          country: customerDetails.country
        }
      });

      console.log("Order processed successfully");
      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error('Error processing order:', error);
      clearCart();
      navigate("/order-success");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container max-w-4xl mx-auto px-4 py-8 mt-32">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container max-w-4xl mx-auto px-4 py-8 mt-32">
        <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
        
        <LoginPrompt />
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-2 md:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <CustomerForm
                country={country}
                setCountry={setCountry}
                region={region}
                setRegion={setRegion}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                address={address}
                setAddress={setAddress}
              />

              {country && (
                <ShippingOptions
                  shippingOptions={shippingOptions}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  currencySymbol={currencySymbol}
                />
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !country || !region || !selectedShipping}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <OrderSummary
              items={items}
              subtotalInCurrentCurrency={subtotalInCurrentCurrency}
              currencySymbol={currencySymbol}
              taxes={taxes}
              selectedShippingOption={selectedShippingOption}
              total={total}
              activePromoCode={activePromoCode}
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;