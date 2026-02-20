import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  Bot,
  Headphones,
  Settings,
  Target,
  Compass,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t } = useTranslation();

  const mainItems = [
    { title: t("nav.dashboard"), url: "/dashboard", icon: LayoutDashboard, tutorialKey: "dashboard" },
    { title: t("nav.actionCenter"), url: "/actions", icon: Target, tutorialKey: "actions" },
    { title: t("nav.roadmap"), url: "/roadmap", icon: Map, tutorialKey: "roadmap" },
    { title: t("nav.schools"), url: "/schools", icon: GraduationCap, tutorialKey: "schools" },
    { title: t("nav.explore"), url: "/explore", icon: Compass, tutorialKey: "explore" },
    { title: t("nav.careers"), url: "/careers", icon: Briefcase, tutorialKey: "careers" },
    { title: t("nav.companies"), url: "/companies", icon: Building2, tutorialKey: "companies" },
    { title: t("nav.networking"), url: "/networking", icon: Users, tutorialKey: "networking" },
  ];

  const toolItems = [
    { title: t("nav.aiAdvisor"), url: "/chat", icon: Bot, tutorialKey: "chat" },
    { title: t("nav.voiceAdvisor"), url: "/voice", icon: Headphones, tutorialKey: "voice" },
    { title: t("nav.language"), url: "/settings#language", icon: Globe, tutorialKey: "language" },
    { title: t("nav.settings"), url: "/settings", icon: Settings, tutorialKey: "settings" },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        <div className="px-4 pb-4">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </span>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      data-tutorial={item.tutorialKey}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-foreground font-semibold"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.tools")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      data-tutorial={item.tutorialKey}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-foreground font-semibold"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
