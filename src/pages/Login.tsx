
import Layout from "@/components/Layout";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <AuthForm type="login" />
      </div>
    </Layout>
  );
};

export default Login;
