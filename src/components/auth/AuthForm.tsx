
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser, registerUser } from "@/lib/api";
import { User } from "@/lib/interfaces";
import { useUserStore } from "@/store/userStore";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  function validateUserRegistration(userData: { username: string; email: string; password: string }) {
    const errors: { username?: string; email?: string; password?: string } = {};
  
    // Validate username
    if (!userData.username || userData.username.trim() === "") {
      errors.username = "Username is required";
    } else if (userData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
  
    // Validate email
    if (!userData.email || userData.email.trim() === "") {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
  
    // Validate password
    if (!userData.password) {
      errors.password = "Password is required";
    } else if (userData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock authentication (in a real app, replace with actual API calls)
      if (type === "login") { 
        const response = await loginUser(email, password);
        if (response.status === 'success') {
          const user: User = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            token: response.data.token,
          };
          localStorage.setItem("token", user.token);
          setUser(user);
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
        navigate("/dashboard");
        } else {
          toast({
            title: "Login failed",
            description: response.message,
            variant: "destructive",
          });
        }
      } else if (type === "signup") {
        const validation = validateUserRegistration({ username: username, email, password });
  
        if (!validation.isValid) {
          console.error("Validation errors:", validation.errors);
          setIsLoading(false);  
          return { success: false, errors: validation.errors };
        }
        const response = await registerUser(username, email, password);
        if (response.status === 'success') {
          const user: User = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            token: response.data.token,
          };
          localStorage.setItem("token", user.token);
          setUser(user);
          toast({
            title: "Account created!",
            description: "Your account has been successfully created.",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Registration failed",
            description: response.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel p-8 rounded-xl neo-shadow animate-scale-in">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {type === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-muted-foreground">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Fill in the form below to create your account"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John Doe"
              required
              className="glass-input"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="glass-input"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === "login" && (
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="glass-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full neo-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === "login" ? "Logging in..." : "Creating account..."}
            </>
          ) : (
            <>{type === "login" ? "Login" : "Create account"}</>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        {type === "login" ? (
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Log in
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
