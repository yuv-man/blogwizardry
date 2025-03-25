
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/lib/interfaces";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    // In a real app, this would generate a proper sharing URL
    const shareUrl = `${window.location.origin}/blog/${post._id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    });
  };

  return (
    <Card className="glass-panel neo-shadow overflow-hidden transition-all duration-300 hover:shadow-lg slide-transition">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-start">
          <Badge variant={post.status === "published" ? "default" : "outline"} className="mb-2">
            {post.status === "published" ? "Published" : "Draft"}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
          </div>
        </div>
        <h3 className="text-xl font-semibold tracking-tight line-clamp-2">{post.title}</h3>
      </CardHeader>
      <CardContent className="px-6 py-2">
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="px-6 pt-2 pb-6 flex justify-between gap-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/edit/${post._id}`}>
              <Edit size={16} className="mr-2" /> Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/blog/${post._id}`}>
              <Eye size={16} className="mr-2" /> View
            </Link>
          </Button>
        </div>
        {post.status === "published" && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            title="Share post"
          >
            <Share2 size={16} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
