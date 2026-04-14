import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Bell, Shield, Key, CreditCard } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Nav */}
        <div className="space-y-1">
          {[
            { icon: User, label: "Profile", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: Key, label: "API Keys", active: false },
            { icon: CreditCard, label: "Billing", active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>This is how others will see you on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input defaultValue="Felix Developer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input defaultValue="felix_dev" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Senior Systems Engineer. Learning Rust and Go. Building the future."
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Addresses</CardTitle>
              <CardDescription>Manage your linked email addresses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-md bg-secondary/20">
                <div>
                  <p className="font-medium text-sm">felix@example.com</p>
                  <p className="text-xs text-muted-foreground">Primary</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6">
              <Button variant="outline">Add Email Address</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
