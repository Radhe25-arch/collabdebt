import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Terminal, Play, Settings2, Clock } from 'lucide-react';

export function Workspaces() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Cloud Workspaces</h1>
          <p className="text-muted-foreground mt-1">Instant, fully-configured development environments.</p>
        </div>
        <Button className="gap-2"><Cloud size={18} /> New Workspace</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { name: "Rust Concurrency Project", env: "Rust 1.75 + Cargo", status: "running", time: "Active now", cpu: "45%", ram: "1.2GB" },
          { name: "Go Microservices", env: "Go 1.21 + Docker", status: "stopped", time: "Last used 2 days ago", cpu: "-", ram: "-" },
          { name: "React Frontend", env: "Node 20 + Vite", status: "stopped", time: "Last used 1 week ago", cpu: "-", ram: "-" },
        ].map((ws, i) => (
          <Card key={i} className={`flex flex-col ${ws.status === 'running' ? 'border-primary/50 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Terminal size={20} className={ws.status === 'running' ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <Badge variant={ws.status === 'running' ? 'default' : 'secondary'}>
                  {ws.status === 'running' ? 'Running' : 'Stopped'}
                </Badge>
              </div>
              <CardTitle className="text-lg">{ws.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-mono">{ws.env}</p>
            </CardHeader>
            <CardContent className="flex-1">
              {ws.status === 'running' && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-secondary/30 rounded-md border border-border mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">CPU Usage</p>
                    <p className="font-mono text-sm">{ws.cpu}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">RAM Usage</p>
                    <p className="font-mono text-sm">{ws.ram}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={14} /> {ws.time}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border gap-2">
              {ws.status === 'running' ? (
                <>
                  <Button className="flex-1" variant="secondary">Open IDE</Button>
                  <Button size="icon" variant="outline"><Settings2 size={16} /></Button>
                </>
              ) : (
                <>
                  <Button className="flex-1 gap-2"><Play size={16} /> Start Workspace</Button>
                  <Button size="icon" variant="outline"><Settings2 size={16} /></Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
