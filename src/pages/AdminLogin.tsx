import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting admin login");

    // For demo purposes, using hardcoded admin credentials
    if (email === "admin@example.com" && password === "admin123") {
      const adminUser = {
        email,
        role: "admin",
        firstName: "Admin",
        lastName: "User"
      };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      console.log("Admin login successful");
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      console.log("Admin login failed");
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center mt-20">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login as Admin
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;