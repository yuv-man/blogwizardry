import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { deleteBlogPost, getBlogPost, updateBlogPost } from "@/lib/api";
import { Post } from "@/lib/interfaces";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  EyeIcon, 
  Share2,
  Trash2,
  Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TipTapEditor from "./TipTapEditor";
import { useLanguageStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";

const BlogEditor = () => {
  const { id } = useParams();
  const [post, setPost] = useState({} as Post);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getBlogPost(id);
        const fetchedPost = response.data.post;
        setPost(fetchedPost);
        setTitle(fetchedPost.title || "");
        setContent(fetchedPost.content || "");
        setExcerpt(fetchedPost.excerpt || "");
        setIsPublished(fetchedPost.status === "published");
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  const handleContentUpdate = (newContent) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: t("missing_required_fields"),
        description: t("title_and_content_are_required"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await updateBlogPost(id, {
        title,
        content,
        excerpt,
        updatedAt: new Date().toISOString(),
        status: isPublished ? "published" : "draft",
      });
      
      if (response.status === 'success') {
        toast({
          title: t("saved_successfully"),
          description: isPublished ? t("post_has_been_published") : t("post_has_been_saved_as_a_draft"),
        });
       
        // Update the post data
        setPost({
          ...post,
          title,
          content,
          excerpt,
          status: isPublished ? "published" : "draft",
          updatedAt: new Date().toISOString(),
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_save_post"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteBlogPost(id);
      if (response.status === 'success') {
        toast({
          title: t("deleted_successfully"),
          description: t("your_post_has_been_deleted"),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_post"),
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (isPublished) {
      // In a real app, this would generate a proper sharing URL
      const shareUrl = `${window.location.origin}/blog/${id}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: t("link_copied"),
          description: t("share_link_has_been_copied_to_your_clipboard"),
        });
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          {t("back_to_dashboard")}
        </Button>
        
        <div className="flex items-center gap-2">
          {isPublished && (
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 size={16} />
              {t("share")}
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => navigate(`/blog/${id}`)}
            className="gap-2"
          >
            <EyeIcon size={16} />
            {t("preview")}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 size={16} />
                {t("delete")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("are_you_sure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("this_action_cannot_be_undone")} {t("this_will_permanently_delete_your_post")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input text-xl"
                placeholder={t("enter_a_title_for_your_blog_post")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">{t("excerpt")}</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="glass-input resize-none"
                placeholder={t("a_brief_summary_of_your_post")}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">{t("content")}</Label>
              <TipTapEditor 
                content={content}
                onUpdate={handleContentUpdate}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-panel p-6 rounded-xl neo-shadow">
            <h3 className="text-lg font-medium mb-4">{t("publish_settings")}</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">{t("published")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isPublished ? t("your_post_is_public") : t("your_post_is_a_draft")}
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              {post.createdAt && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t("created")}</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {post.updatedAt && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t("last_updated")}</span>
                  <span>
                    {new Date(post.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              <Button 
                onClick={handleSave} 
                className="w-full neo-button"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isPublished ? t("save_and_publish") : t("save_as_draft")}
                  </>
                )}
              </Button>
              
              {isPublished && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Globe size={14} />
                  <span>{t("public_link_available_after_saving")}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="glass-panel p-6 rounded-xl neo-shadow">
            <h3 className="text-lg font-medium mb-4">{t("content_preview")}</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h1 className="text-xl font-bold mb-2">{title || t("your_title")}</h1>
              <p className="text-muted-foreground mb-4">{excerpt || t("your_excerpt")}</p>
              {content ? (
                <div className="line-clamp-[15]">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              ) : (
                <p className="text-muted-foreground italic">{t("no_content_yet")}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;