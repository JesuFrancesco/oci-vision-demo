"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNavigation from "@/components/dashboard-navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUserEmail(email || "");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userEmail={userEmail}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <DashboardNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main
        className={`transition-opacity duration-300 pt-20 ${
          isSidebarOpen ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Panel de Control
              </h1>
              <p className="text-muted-foreground mt-2">
                Bienvenido a tu panel de control de inventario
              </p>
            </div>

            {/* <DashboardStats /> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Gestiona tu inventario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="hover:cursor-pointer w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start"
                    onClick={() => router.push("/heatmap")}
                  >
                    Ver Mapa de Calor
                  </Button>
                  <Button
                    className="hover:cursor-pointer w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start"
                    onClick={() => router.push("/vip-clients")}
                  >
                    Clientes VIP
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    Generar Reporte
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas 5 actualizaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        time: "Hace 2 horas",
                        action: "Inventario actualizado",
                      },
                      {
                        time: "Hace 4 horas",
                        action: "Nuevo cliente VIP agregado",
                      },
                      {
                        time: "Hace 1 día",
                        action: "Mapa de calor actualizado",
                      },
                      {
                        time: "Hace 2 días",
                        action: "Copia de seguridad completada",
                      },
                      {
                        time: "Hace 3 días",
                        action: "Reporte mensual generado",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm pb-2 border-b border-border last:border-0"
                      >
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
