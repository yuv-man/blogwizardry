import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Edit } from "lucide-react";
import { getBlogPostsByUserId } from "@/lib/api";
import { Post } from "@/lib/interfaces";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/userStore";

// Dynamic import for BlogCard
const BlogCard = lazy(() => import("../blog/BlogCard"));

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("user") || "{}");
    if (store) {
      const user = store.state.user;
      fetchPosts(user.id);
    }
  }, [language]);

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

  const renderPosts = (posts: Post[]) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.length > 0 && posts.map(post => (
        <Suspense key={post._id} fallback={<div className="glass-panel rounded-lg p-4">Loading...</div>}>
          <BlogCard post={post} />
        </Suspense>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('your_blog_posts')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('manage_and_create_your_ai_generated_content')}
          </p>
        </div>
        <Button 
          onClick={() => navigate("/generate")} 
          className="neo-button"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('create_new_post')}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="all">{t('all_posts')}</TabsTrigger>
          <TabsTrigger value="published">{t('published')}</TabsTrigger>
          <TabsTrigger value="draft">{t('drafts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('no_posts_yet')}</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {t('create_first_post')}
              </p>
              <Button 
                onClick={() => navigate("/generate")} 
                className="neo-button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('create_new_post')}
              </Button>
            </div>
          ) : renderPosts(filteredPosts)}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('no_published_posts')}</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {t('publish_your_drafts')}
              </p>
              <Button 
                onClick={() => navigate("/generate")} 
                className="neo-button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('create_new_post')}
              </Button>
            </div>
          ) : renderPosts(filteredPosts)}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-lg">
              <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('no_draft_posts')}</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {t('start_creating_content')}
              </p>
              <Button 
                onClick={() => navigate("/generate")} 
                className="neo-button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('create_new_post')}
              </Button>
            </div>
          ) : renderPosts(filteredPosts)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
