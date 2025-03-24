
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import BlogGenerator from "@/components/blog/BlogGenerator";

const Generate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <BlogGenerator />
    </Layout>
  );
};

export default Generate;
