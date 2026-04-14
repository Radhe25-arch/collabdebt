import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, Eye, Clock } from 'lucide-react';

export function Forum() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Community Forum</h1>
          <p className="text-muted-foreground mt-1">Discuss architecture, share solutions, and get help.</p>
        </div>
        <Button>New Discussion</Button>
      </div>

      <div className="space-y-4">
        {[
          { title: "Best practices for structuring a large Go monorepo?", author: "@gopher_king", replies: 42, views: "1.2k", likes: 156, tags: ["Go", "Architecture"], time: "2h ago" },
          { title: "Understanding the borrow checker in complex lifetimes", author: "@rustacean", replies: 18, views: "850", likes: 94, tags: ["Rust", "Help"], time: "5h ago" },
          { title: "Showcase: I built a distributed KV store in Zig", author: "@zig_zag", replies: 64, views: "3.4k", likes: 420, tags: ["Zig", "Systems", "Showcase"], time: "1d ago" },
          { title: "Why is my React app re-rendering infinitely here?", author: "@frontend_dev", replies: 5, views: "120", likes: 12, tags: ["React", "Help"], time: "1d ago" },
        ].map((post, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold hover:text-primary transition-colors">{post.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.time}</span>
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] py-0">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={16} /> {post.likes}
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={16} /> {post.replies}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={16} /> {post.views}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
