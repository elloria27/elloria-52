import { User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export const UserMenu = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-primary transition-colors"
          onClick={() => currentUser && navigate("/account")}
        >
          <User className="h-5 w-5" />
        </motion.button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-6 bg-white shadow-lg border border-gray-100">
        {currentUser ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </h4>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white" 
                variant="default"
                onClick={() => navigate("/account")}
              >
                View Account
              </Button>
              <Button 
                className="w-full" 
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Welcome to Elloria</h4>
            <p className="text-sm text-gray-500">
              Sign in to access your account or create one to enjoy exclusive benefits and faster checkout.
            </p>
            <div className="flex gap-3">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white" 
                variant="default"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900" 
                variant="outline"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};