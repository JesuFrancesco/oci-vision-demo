"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DashboardNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardNavigation({
  isOpen,
  onClose,
}: DashboardNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Panel de Control", href: "/dashboard", icon: "📊" },
    { label: "Mapa de Calor", href: "/heatmap", icon: "🔥" },
    { label: "Clientes VIP", href: "/vip-clients", icon: "👥" },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-sidebar border-r border-sidebar-border z-40 flex flex-col transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto overflow-x-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
              SL
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Supermercados</span>
              <span className="text-xs text-sidebar-foreground/70">Lima</span>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "default" : "ghost"}
                className={`hover:cursor-pointer w-full justify-start gap-3 ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`}
                onClick={() => handleNavigate(item.href)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={onClose}
          style={{ top: "80px" }}
        />
      )}
    </>
  );
}
