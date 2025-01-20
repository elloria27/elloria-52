import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting registration process...");
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password validation (at least 8 characters)
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Store user data in localStorage (temporary solution)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email already exists
      if (users.some((user: any) => user.email === formData.email)) {
        toast.error("An account with this email already exists");
        setIsLoading(false);
        return;
      }

      // Add new user
      users.push({
        id: Date.now(),
        ...formData,
        password: btoa(formData.password) // Basic encoding (not secure, just for demo)
      });
      
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify({
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      }));

      console.log("Registration successful");
      toast.success("Registration successful!");
      
      // Redirect to home page after successful registration
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign in
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center gap-2"
            disabled={isLoading}
          >
            <UserPlus className="h-5 w-5" />
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;