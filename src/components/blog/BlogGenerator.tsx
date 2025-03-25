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
import { generateBlogPost, saveBlogPost } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/userStore";

const BlogGenerator = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("professional");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedExcerpt, setGeneratedExcerpt] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const writingStyles = [
    { value: "professional", label: t("professional") },
    { value: "casual", label: t("casual") },
    { value: "academic", label: t("academic") },
    { value: "creative", label: t("creative") },
    { value: "conversational", label: t("conversational") },
  ];

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: t("topic_required"),
        description: t("please_enter_a_topic_for_your_blog_post"),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setGeneratedTitle("");

    try {
      const response = await generateBlogPost(topic, style, keywords, language);
      if (response.data) {
        setGeneratedContent(response.data.content);
        setGeneratedExcerpt(response.data.excerpt);
        setGeneratedTitle(response.data.title);
        toast({
          title: t("blog_post_generated"),
          description: t("your_content_has_been_created_successfully"),
        });
      }
    } catch (error) {
      toast({
        title: t("generation_failed"),
        description: t("there_was_an_error_generating_your_content_please_try_again"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;
    const postData = {
      title: generatedTitle,
      content: generatedContent,
      excerpt: generatedExcerpt,
      author: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
    };
    const response = await saveBlogPost(postData);
    if (response.data) {
      toast({
        title: t("blog_post_saved"),
        description: t("your_post_has_been_saved_as_a_draft"),
      });
      navigate(`/edit/${response.data.post._id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{t("create_new_blog_post")}</h2>
          <p className="text-muted-foreground">
            {t("generate_ai_powered_content_by_entering_a_topic_and_selecting_a_writing_style")}
          </p>
        </div>

        <div className="space-y-4 glass-panel p-6 rounded-xl neo-shadow">
          <div className="space-y-2">
            <Label htmlFor="topic">{t("topic")}</Label>
            <Input
              id="topic"
              placeholder={t("e_g_artificial_intelligence_in_healthcare")}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">{t("writing_style")}</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style" className="glass-input">
                <SelectValue placeholder={t("select_a_writing_style")} />
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
            <Label htmlFor="keywords">{t("keywords_optional")}</Label>
            <Textarea
              id="keywords"
              placeholder={t("enter_keywords_separated_by_commas")}
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
                {t("generating")}...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {t("generate_content")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {generatedTitle || t("generated_content")}
          </h2>
          {generatedContent && (
            <Button onClick={handleSave} className="neo-button">
              <Save className="mr-2 h-4 w-4" />
              {t("save_draft")}
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
                    {t("generating_your_content")}...
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
                    {t("generated_content_will_appear_here")}
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
