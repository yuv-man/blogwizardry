
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import BlogEditor from "@/components/blog/BlogEditor";

const Edit = () => {
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
      <BlogEditor />
    </Layout>
  );
};

export default Edit;
