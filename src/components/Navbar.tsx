import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/userStore";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
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
            {/* Language Selector */}
            <li className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="flex items-center gap-2"
              >
                <Globe size={20} />
              </Button>
              <div className="absolute right-0 mt-2 w-32 py-2 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 before:absolute before:h-3 before:w-full before:-top-3 before:left-0">
                <button
                  onClick={() => changeLanguage('en')}
                  className="w-full px-4 py-2 text-left hover:bg-accent"
                >
                  {t('english')}
                </button>
                <button
                  onClick={() => changeLanguage('he')}
                  className="w-full px-4 py-2 text-left hover:bg-accent"
                >
                  {t('hebrew')}
                </button>
              </div>
            </li>

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
                    {t('dashboard')}
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
                    {t('generate')}
                  </Link>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    className="text-foreground/80 hover:text-foreground"
                    onClick={handleLogout}
                  >
                    {t('logout')}
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
              {/* Language Selector for Mobile */}
              <li className="border-b pb-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-foreground/70">{t('select_language')}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeLanguage('en')}
                      className={cn(
                        "flex-1",
                        i18n.language === 'en' && "bg-primary text-primary-foreground"
                      )}
                    >
                      {t('english')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeLanguage('he')}
                      className={cn(
                        "flex-1",
                        i18n.language === 'he' && "bg-primary text-primary-foreground"
                      )}
                    >
                      {t('hebrew')}
                    </Button>
                  </div>
                </div>
              </li>
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
                      {t('dashboard')}
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
