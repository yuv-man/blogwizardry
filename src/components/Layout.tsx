
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  withNavbar?: boolean;
}

const Layout = ({ children, withNavbar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {withNavbar && <Navbar />}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 page-transition">
        {children}
      </main>
    </div>
  );
};

export default Layout;
