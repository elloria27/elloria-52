import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Logo } from "@/components/header/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl') || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    console.log("Attempting login with email:", email);

    try {
      const storedUsers = localStorage.getItem('users');
      console.log("Retrieved stored users");
      
      if (!storedUsers) {
        console.error("No users found in storage");
        throw new Error("No registered users found");
      }

      const users = JSON.parse(storedUsers);
      console.log("Number of stored users:", users.length);
      
      // Case-insensitive email comparison
      const user = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      console.log("User found:", user ? "Yes" : "No");

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Store user data without sensitive information
      const userForStorage = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address
      };

      localStorage.setItem('currentUser', JSON.stringify(userForStorage));
      console.log("User successfully logged in");
      
      toast.success("Welcome back!");
      navigate(returnUrl);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Logo />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => navigate("/register")}
          >
            Create one
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Login;