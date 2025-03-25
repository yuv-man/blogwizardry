
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { getBlogPost } from "@/lib/api";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Loader2,
  Twitter,
  Facebook,
  Linkedin
} from "lucide-react";


const PublicBlog = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getBlogPost(id);
        if (post.status === 'success') {
          console.log(post.data.post);
          setPost(post.data.post);
        }

      } catch (error) {
        toast({
          title: t("error"),
          description: t("failed_to_load_blog_post"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  const handleShare = (platform?: string) => {
    const shareUrl = window.location.href;
    const shareText = post?.title || "Check out this blog post";
    
    let shareLink = "";
    
    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: t("link_copied"),
            description: t("share_link_copied_to_clipboard_description"),
          });
        });
        return;
    }
    
    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-2xl font-bold mb-4">{t("blog_post_not_found")}</h2>
        <p className="text-muted-foreground mb-6">
          {t("blog_post_not_found_description")}
        </p>
        <Button asChild>
          <Link to="/">{t("go_to_homepage")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("twitter")}
            title={t("share_on_twitter")}
          >
            <Twitter size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("facebook")}
            title={t("share_on_facebook")}
          >
            <Facebook size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("linkedin")}
            title={t("share_on_linkedin")}
          >
            <Linkedin size={16} />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleShare()}
            className="gap-2"
          >
            <Share2 size={16} />
            {t("copy_link")}
          </Button>
        </div>
      </div>

      <article className="glass-panel rounded-xl p-8 neo-shadow">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.authorName && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {post.authorName?.charAt(0)}
                </div>
                <span>{post.authorName}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
        </div>
      </article>
      
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium mb-4">{t("share_this_article")}</h3>
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("twitter")}
            className="h-10 w-10 rounded-full"
            title={t("share_on_twitter")}
          >
            <Twitter size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("facebook")}
            className="h-10 w-10 rounded-full"
            title={t("share_on_facebook")}
          >
            <Facebook size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("linkedin")}
            className="h-10 w-10 rounded-full"
            title={t("share_on_linkedin")}
          >
            <Linkedin size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare()}
            className="h-10 w-10 rounded-full"
            title={t("copy_link")}
          >
            <Share2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicBlog;
