
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Lightbulb, 
  MessageSquareText,
  Settings,
  LayoutDashboard,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { UserNav } from "./UserNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/subjects", label: "My Subjects", icon: BookOpen },
    { href: "/learn", label: "Learning Path", icon: Lightbulb },
    { href: "/chat", label: "AI Assistant", icon: MessageSquareText },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <MobileNav navItems={navItems} />
        <div className="flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-edu-primary to-edu-accent flex items-center justify-center text-white font-bold text-sm">
              VL
            </div>
            <span className="font-bold text-xl">VisualLearn</span>
          </Link>
          <UserNav />
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-card md:flex">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-edu-primary to-edu-accent flex items-center justify-center text-white font-bold text-sm">
                VL
              </div>
              <span className="font-bold text-lg">VisualLearn</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto p-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "nav-link",
                        isActive && "nav-link-active"
                      )}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">
                Upgrade Plan
              </h3>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
              >
                <CreditCard size={16} />
                Go Premium
              </Button>
            </div>
          </nav>
          <div className="border-t p-4">
            <UserNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
