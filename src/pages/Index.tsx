
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  ArrowRight,
  Sparkles,
  Edit,
  Share2,
  MessageSquare,
  Database,
  Zap,
  MessageSquareText,
  MousePointerClick,
  Layers
} from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 md:py-32 animate-fade-in">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-primary/10 text-primary">
            <Sparkles size={14} className="mr-2" />
            <span>AI-Powered Blog Creation Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Transform Your Ideas Into Engaging Blog Content
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate professional blog posts in seconds with our AI-powered platform. Edit, save, and share your content with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="neo-button text-lg gap-2"
              onClick={() => navigate(isLoggedIn ? "/generate" : "/signup")}
            >
              {isLoggedIn ? "Create New Post" : "Get Started"}
              <ArrowRight size={18} />
            </Button>
            
            {!isLoggedIn && (
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50 rounded-3xl my-10 animate-slide-up">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Content Creation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and share high-quality blog content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl neo-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-muted-foreground">
                Create high-quality blog posts with just a few clicks using advanced AI technology
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl neo-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intuitive Editor</h3>
              <p className="text-muted-foreground">
                Customize your content with our easy-to-use editor designed for writers of all levels
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl neo-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Click Sharing</h3>
              <p className="text-muted-foreground">
                Share your content across social media platforms or via direct link with a single click
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl neo-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Writing Styles</h3>
              <p className="text-muted-foreground">
                Choose from various writing styles to match your brand voice and target audience
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl neo-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Content Dashboard</h3>
              <p className="text-muted-foreground">
                Manage all your blog posts in one place with our organized dashboard interface
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl neo-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate full blog posts in seconds, saving you hours of writing and research time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 animate-slide-up">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create amazing blog content in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquareText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Enter Your Topic</h3>
              <p className="text-muted-foreground">
                Provide a topic and select your preferred writing style for your blog post
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MousePointerClick className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Generate Content</h3>
              <p className="text-muted-foreground">
                Click generate and watch as our AI creates a fully-formed blog post for you in seconds
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Edit and Publish</h3>
              <p className="text-muted-foreground">
                Customize your content, save it as a draft, or publish it immediately with one click
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 glass-panel rounded-3xl my-10 animate-slide-up">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Blog Content?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who are saving time and producing high-quality blog posts with our AI-powered platform.
          </p>
          <Button
            size="lg"
            className="neo-button text-lg gap-2"
            onClick={() => navigate(isLoggedIn ? "/generate" : "/signup")}
          >
            {isLoggedIn ? "Start Creating" : "Get Started for Free"}
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
