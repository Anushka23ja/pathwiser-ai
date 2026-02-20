import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Map, Compass, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard", tutorialKey: "dashboard" },
  { label: "Roadmap", icon: Map, path: "/roadmap", tutorialKey: "roadmap" },
  { label: "Explore", icon: Compass, path: "/explore", tutorialKey: "explore" },
  { label: "Chat", icon: MessageCircle, path: "/chat", tutorialKey: "chat" },
  { label: "Settings", icon: Settings, path: "/settings", tutorialKey: "settings" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              data-tutorial={tab.tutorialKey}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className={cn(
                "text-[10px] font-medium leading-none",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
