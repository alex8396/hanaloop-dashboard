"use client";

import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Company } from "@/lib/api";
import { Loader2, MessageSquarePlus, MessageCircle, AlertCircle } from "lucide-react";

export function PostManager({ companies }: { companies: Company[] }) {
  const { posts, isLoading, addPostOptimistic } = usePosts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]?.id || "");
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !companyId) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Optimistic Update!
      await addPostOptimistic({
        title,
        content,
        resourceUid: companyId,
        dateTime
      });
      setTitle("");
      setContent("");
    } catch (error) {
      setErrorMsg("Failed to save post. Changes have been reverted.");
      // Rollback already handled in hook, just show error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          경영진 인사이트
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Post List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 border border-border rounded-md p-3 bg-accent/20">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-8">아직 등록된 인사이트가 없습니다.</p>
          ) : (
            posts.map(post => {
              const companyName = companies.find(c => c.id === post.resourceUid)?.name || "Unknown";
              return (
                <div key={post.id} className="bg-card border border-border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-foreground">{post.title}</h4>
                    <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">{post.dateTime}</span>
                  </div>
                  <p className="text-xs font-medium text-primary mb-2">@ {companyName}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Add Post Form */}
        <div className="pt-4 border-t border-border mt-auto">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" /> 인사이트 추가
          </h4>
          
          {errorMsg && (
            <div className="mb-3 p-2 bg-destructive/10 border border-destructive/30 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={companyId} 
                onChange={e => setCompanyId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Input 
                type="month" 
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
              />
            </div>
            <Input 
              placeholder="인사이트 제목" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="관찰 내용 및 대응 전략을 입력하세요..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSubmitting ? "저장 중..." : "저장하기"}
            </Button>
          </form>
        </div>

      </CardContent>
    </Card>
  );
}
