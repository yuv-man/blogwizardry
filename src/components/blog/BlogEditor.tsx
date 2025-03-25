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

const BlogEditor = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post>({} as Post);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [isPublished, setIsPublished] = useState(post.status === "published");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getBlogPost(id);
        setPost(post.data.post);
        setTitle(post.data.post.title);
        setContent(post.data.post.content);
        setExcerpt(post.data.post.excerpt);
        setIsPublished(post.data.post.status === "published");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: "Missing required fields",
        description: "Title and content are required",
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
        status: isPublished ? "published" : "draft",
      });
      if (response.status === 'success') {
        toast({
          title: "Saved successfully",
          description: isPublished ? "Your post has been published" : "Your post has been saved as a draft",
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
        title: "Error",
        description: "Failed to save post",
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
          title: "Deleted successfully",
          description: "Your post has been deleted",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
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
          title: "Link copied!",
          description: "Share link has been copied to your clipboard",
        });
      });
    };
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
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-2">
          {isPublished && (
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 size={16} />
              Share
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => navigate(`/blog/${id}`)}
            className="gap-2"
          >
            <EyeIcon size={16} />
            Preview
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 size={16} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input text-xl"
                placeholder="Enter a title for your blog post"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="glass-input resize-none"
                placeholder="A brief summary of your post"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="glass-input resize-none min-h-[500px]"
                placeholder="Write your blog content here..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-panel p-6 rounded-xl neo-shadow">
            <h3 className="text-lg font-medium mb-4">Publish Settings</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    {isPublished ? "Your post is public" : "Your post is a draft"}
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Created</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Last updated</span>
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

              <Button 
                onClick={handleSave} 
                className="w-full neo-button"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save {isPublished ? "& Publish" : "as Draft"}
                  </>
                )}
              </Button>
              
              {isPublished && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Globe size={14} />
                  <span>Public link available after saving</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="glass-panel p-6 rounded-xl neo-shadow">
            <h3 className="text-lg font-medium mb-4">Content Preview</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h1 className="text-xl font-bold mb-2">{title || "Your title"}</h1>
              <p className="text-muted-foreground mb-4">{excerpt || "Your excerpt"}</p>
              {content ? (
                <div className="line-clamp-[15]">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                </div>
              ) : (
                <p className="text-muted-foreground italic">No content yet...</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;  
