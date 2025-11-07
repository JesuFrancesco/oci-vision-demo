"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  userEmail: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function DashboardHeader({
  userEmail,
  onLogout,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    applyTheme(darkMode);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    applyTheme(newMode);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-4 px-6 shadow-md border-b border-primary/20">
      <div className="max-w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-primary-foreground hover:bg-primary/20 hover:cursor-pointer rounded-md"
            title="Alternar menú"
          >
            <Menu size={20} />
          </Button>
          <div
            className="hover:cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <h1 className="text-2xl font-bold">Supermercados Lima</h1>
            <p className="text-sm opacity-90">
              Plataforma de Análisis e Inventario
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm opacity-90">
            Sesión: <span className="font-semibold">{userEmail}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="hover:cursor-pointer border-primary-foreground/50 text-primary-foreground hover:bg-primary/20 bg-transparent"
            title={isDarkMode ? "Modo claro" : "Modo oscuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="hover:cursor-pointer border-primary-foreground/50 text-primary-foreground hover:bg-primary/20 bg-transparent"
          >
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
}
