
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Save } from "lucide-react";

const writingStyles = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "academic", label: "Academic" },
  { value: "creative", label: "Creative" },
  { value: "conversational", label: "Conversational" },
];

const BlogGenerator = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("professional");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your blog post",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setGeneratedTitle("");

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Mock generated content (In a real app, this would come from OpenAI or another LLM)
      const mockTitle = `The Complete Guide to ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
      
      const mockContent = `
# ${mockTitle}

## Introduction

In today's rapidly evolving landscape, ${topic} has become increasingly significant. This comprehensive guide explores the key aspects, challenges, and opportunities related to ${topic}.

## Understanding the Fundamentals

Before diving deeper, it's essential to understand what ${topic} actually entails. At its core, ${topic} represents a paradigm shift in how we approach problem-solving and innovation.

## Key Benefits

- Enhanced efficiency and productivity
- Reduced operational costs
- Improved user experience
- Greater scalability and flexibility
- More sustainable outcomes

## Common Challenges

Despite its numerous advantages, implementing ${topic} isn't without challenges. Organizations often struggle with:

1. Integration with existing systems
2. Staff training and adaptation
3. Initial investment costs
4. Regulatory compliance
5. Data security concerns

## Best Practices for Implementation

Successful implementation of ${topic} requires careful planning and execution. Consider these best practices:

- Start with a clear strategy and objectives
- Invest in proper training and support
- Begin with pilot projects before full-scale deployment
- Regularly assess and measure results
- Stay updated with industry trends and developments

## Future Outlook

The future of ${topic} looks promising, with continuous innovations expected to drive further adoption across industries. As technology evolves, we can anticipate more sophisticated applications and use cases.

## Conclusion

${topic} represents not just a technological advancement but a fundamental shift in how we approach our work and lives. By understanding its potential and challenges, organizations and individuals can better position themselves for success in an increasingly competitive environment.
      `;

      // Set the generated content and title with a typewriter effect
      setGeneratedTitle(mockTitle);
      
      let i = 0;
      const typewriterInterval = setInterval(() => {
        if (i < mockContent.length) {
          setGeneratedContent(mockContent.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typewriterInterval);
        }
      }, 10);
      
      toast({
        title: "Blog post generated!",
        description: "Your content has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    
    // In a real app, this would save to the backend
    toast({
      title: "Blog post saved!",
      description: "Your post has been saved as a draft",
    });
    
    // Navigate to edit page with the generated content
    // For demo purposes, we'll just navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Create New Blog Post</h2>
          <p className="text-muted-foreground">
            Generate AI-powered content by entering a topic and selecting a writing style
          </p>
        </div>

        <div className="space-y-4 glass-panel p-6 rounded-xl neo-shadow">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="E.g., Artificial Intelligence in Healthcare"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Writing Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style" className="glass-input">
                <SelectValue placeholder="Select a writing style" />
              </SelectTrigger>
              <SelectContent>
                {writingStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (optional)</Label>
            <Textarea
              id="keywords"
              placeholder="Enter keywords separated by commas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="glass-input resize-none"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            className="w-full neo-button"
            disabled={isGenerating || !topic}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {generatedTitle || "Generated Content"}
          </h2>
          {generatedContent && (
            <Button onClick={handleSave} className="neo-button">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          )}
        </div>

        <Card className="glass-panel rounded-xl neo-shadow min-h-[500px] overflow-hidden relative">
          <CardContent className="p-6">
            {isGenerating && !generatedContent ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground animate-pulse">
                    Generating your content...
                  </p>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none markdown-content">
                <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br>') }} />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Sparkles className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Generated content will appear here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogGenerator;
