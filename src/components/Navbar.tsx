
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <header className="w-full border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">BlogWizardry</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={cn(
                      "text-foreground/80 hover:text-foreground transition-colors",
                      location.pathname === "/dashboard" && "text-primary font-medium"
                    )}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/generate" 
                    className={cn(
                      "text-foreground/80 hover:text-foreground transition-colors",
                      location.pathname === "/generate" && "text-primary font-medium"
                    )}
                  >
                    Generate
                  </Link>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    className="text-foreground/80 hover:text-foreground"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={cn(
                      "text-foreground/80 hover:text-foreground transition-colors",
                      location.pathname === "/login" && "text-primary font-medium"
                    )}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Button asChild className="neo-button">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel animate-slide-down">
          <nav className="container py-4">
            <ul className="flex flex-col gap-4">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={cn(
                        "block py-2 text-foreground/80 hover:text-foreground transition-colors",
                        location.pathname === "/dashboard" && "text-primary font-medium"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/generate" 
                      className={cn(
                        "block py-2 text-foreground/80 hover:text-foreground transition-colors",
                        location.pathname === "/generate" && "text-primary font-medium"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Generate
                    </Link>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start py-2 text-foreground/80 hover:text-foreground"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className={cn(
                        "block py-2 text-foreground/80 hover:text-foreground transition-colors",
                        location.pathname === "/login" && "text-primary font-medium"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Button 
                      asChild 
                      className="w-full neo-button"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
