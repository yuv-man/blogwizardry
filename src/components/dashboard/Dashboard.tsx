import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Edit } from "lucide-react";
import BlogCard from "../blog/BlogCard";
import { getBlogPostsByUserId } from "@/lib/api";
import { Post, User } from "@/lib/interfaces";

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("user") || "{}");
    if (store) {
      const user = store.state.user;
      fetchPosts(user.id);
    }
  }, []);

  const fetchPosts = async (id: string) => {
    try {
      const posts = await getBlogPostsByUserId(id);
      if (posts.status === 'success') {
        setPosts(posts.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const filteredPosts = useMemo(() => 
    activeTab === "all" 
      ? posts 
      : posts.filter(post => post.status === activeTab),
    [posts, activeTab]
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and create your AI-generated content
          </p>
        </div>
        <Button 
          onClick={() => navigate("/generate")} 
          className="neo-button"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No posts yet</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Create your first blog post with AI-powered assistance
              </p>
              <Button 
                onClick={() => navigate("/generate")} 
                className="neo-button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.length > 0 && filteredPosts.map(post => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No published posts</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Publish your drafts to make them visible here
              </p>
              <Button 
                onClick={() => navigate("/generate")} 
                className="neo-button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.length > 0 && filteredPosts.map(post => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-lg">
              <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No draft posts</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Start creating content to save as drafts
              </p>
              <Button 
                onClick={() => navigate("/generate")} 
                className="neo-button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.length > 0 && filteredPosts.map(post => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
