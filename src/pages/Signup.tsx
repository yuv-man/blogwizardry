
import Layout from "@/components/Layout";
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <AuthForm type="signup" />
      </div>
    </Layout>
  );
};

export default Signup;
