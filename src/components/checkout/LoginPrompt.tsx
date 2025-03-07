import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export const LoginPrompt = () => {
  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // If user is logged in, show welcome message
  if (currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-accent-purple/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Hello, {currentUser.firstName} {currentUser.lastName}</h3>
            <p className="text-sm text-gray-600">You're signed in and ready to complete your purchase</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // If user is checking out as guest
  if (isGuest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-accent-purple/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Checking out as a guest</h3>
            <p className="text-sm text-gray-600">You can create an account after checkout</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default view for non-logged in users
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent-purple/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Sign in for a faster checkout</h3>
            <p className="text-sm text-gray-600">Access your saved addresses and payment methods</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="default" className="gap-2" onClick={() => navigate("/login")}>
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
          <Button variant="outline" onClick={() => setIsGuest(true)}>
            Continue as Guest
          </Button>
        </div>
      </div>
    </motion.div>
  );
};