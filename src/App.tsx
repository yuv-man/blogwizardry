import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Edit from "./pages/Edit";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import { useLanguageStore } from "./store/userStore";

const queryClient = new QueryClient();

const App = () => {
  const { language } = useLanguageStore();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir={language === 'he' ? 'rtl' : 'ltr'}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
