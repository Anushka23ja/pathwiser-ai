import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  Bot,
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
    { title: t("nav.dashboard"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("nav.actionCenter"), url: "/actions", icon: Target },
    { title: t("nav.roadmap"), url: "/roadmap", icon: Map },
    { title: t("nav.explore"), url: "/explore", icon: Compass },
    { title: t("nav.schools"), url: "/schools", icon: GraduationCap },
    { title: t("nav.careers"), url: "/careers", icon: Briefcase },
    { title: t("nav.companies"), url: "/companies", icon: Building2 },
    { title: t("nav.networking"), url: "/networking", icon: Users },
  ];

  const toolItems = [
    { title: t("nav.aiAdvisor"), url: "/chat", icon: Bot },
    { title: t("nav.language"), url: "/settings#language", icon: Globe },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
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
