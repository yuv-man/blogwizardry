
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

// Mock data for blog post
const mockPost = {
  id: "1",
  title: "The Future of AI in Content Creation",
  content: `
# The Future of AI in Content Creation

## Introduction

In today's rapidly evolving digital landscape, artificial intelligence (AI) is transforming how content is created, distributed, and consumed. This post explores the current state of AI in content creation and looks ahead to future developments.

## Current Applications

AI is already being utilized across various content creation processes:

- **Text Generation**: AI systems can draft articles, product descriptions, and social media posts.
- **Image Creation**: Tools like DALL-E and Midjourney generate images from text prompts.
- **Video Production**: AI assists with editing, captioning, and even generating simple animations.
- **Audio Creation**: From voice synthesis to music composition, AI is revolutionizing audio content.

## Benefits and Challenges

### Benefits
- **Efficiency**: AI can create content at scale, saving time and resources.
- **Personalization**: Content can be tailored to individual preferences automatically.
- **Accessibility**: AI tools make content creation accessible to those without specialized skills.

### Challenges
- **Quality Control**: AI-generated content may lack nuance or contain inaccuracies.
- **Ethical Considerations**: Issues around copyright, attribution, and misuse remain unresolved.
- **Human Creativity**: Concerns about the replacement of human creativity and expression.

## The Future Landscape

As AI technology continues to advance, we can expect several developments:

1. **Increased Sophistication**: AI will become better at mimicking human writing styles and creative thinking.
2. **Collaborative Tools**: Rather than replacing humans, AI will evolve as a collaborative partner in the creative process.
3. **Specialized Applications**: Industry-specific AI tools will emerge for fields like legal, medical, and technical content.
4. **Democratization of Creation**: More people will have access to professional-quality content creation capabilities.

## Conclusion

AI in content creation represents both opportunity and challenge. The technology will continue to evolve, and its impact will depend largely on how we choose to implement and regulate it. The future lies not in AI replacing human creativity, but in finding the optimal balance between human ingenuity and machine efficiency.
  `,
  excerpt: "Exploring how artificial intelligence is transforming the way we create and consume content in the digital age.",
  author: "John Doe",
  createdAt: "2023-10-15T10:30:00.000Z",
  updatedAt: "2023-10-15T14:45:00.000Z",
  readingTime: "5 min read",
  status: "published",
};

const PublicBlog = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // For demo, use mock data
        setPost(mockPost);
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
            title: "Link copied!",
            description: "Share link has been copied to your clipboard",
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
        <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">Go to Homepage</Link>
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
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("twitter")}
            title="Share on Twitter"
          >
            <Twitter size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("facebook")}
            title="Share on Facebook"
          >
            <Facebook size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("linkedin")}
            title="Share on LinkedIn"
          >
            <Linkedin size={16} />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleShare()}
            className="gap-2"
          >
            <Share2 size={16} />
            Copy Link
          </Button>
        </div>
      </div>

      <article className="glass-panel rounded-xl p-8 neo-shadow">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {post.author.charAt(0)}
                </div>
                <span>{post.author}</span>
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
        <h3 className="text-lg font-medium mb-4">Share this article</h3>
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("twitter")}
            className="h-10 w-10 rounded-full"
            title="Share on Twitter"
          >
            <Twitter size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("facebook")}
            className="h-10 w-10 rounded-full"
            title="Share on Facebook"
          >
            <Facebook size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare("linkedin")}
            className="h-10 w-10 rounded-full"
            title="Share on LinkedIn"
          >
            <Linkedin size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleShare()}
            className="h-10 w-10 rounded-full"
            title="Copy link"
          >
            <Share2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicBlog;
