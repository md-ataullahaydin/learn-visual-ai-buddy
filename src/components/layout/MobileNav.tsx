
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface MobileNavProps {
  navItems: NavItem[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 sm:max-w-xs">
        <Link
          to="/"
          className="flex items-center gap-2 px-2"
          onClick={() => setOpen(false)}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-edu-primary to-edu-accent flex items-center justify-center text-white font-bold text-sm">
            VL
          </div>
          <span className="font-bold text-xl">VisualLearn</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "nav-link",
                  isActive && "nav-link-active"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
