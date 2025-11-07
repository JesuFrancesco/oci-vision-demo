"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNavigation from "@/components/dashboard-navigation";
import VIPClientCard from "@/components/vip-client-card";
import { MapPin, Camera } from "lucide-react";

interface DetectedFace {
  id: number;
  name: string;
  avatar: string;
  store: string;
  section: string;
  time: string;
  image: string;
}

export default function VIPClientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail") || ""
      : "";

  const detectedFaces: DetectedFace[] = [
    {
      id: 1,
      name: "María González",
      avatar: "MG",
      store: "Lima Centro",
      section: "Sección de Verduras",
      time: "Hace 2 horas",
      image: "/placeholder.svg?key=face1",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      avatar: "CR",
      store: "Miraflores",
      section: "Pasillo de Bebidas",
      time: "Hace 1 hora",
      image: "/placeholder.svg?key=face2",
    },
    {
      id: 3,
      name: "Ana María López",
      avatar: "AL",
      store: "San Isidro",
      section: "Sección de Panadería",
      time: "Hace 45 minutos",
      image: "/placeholder.svg?key=face3",
    },
    {
      id: 4,
      name: "Rosa Fernández",
      avatar: "RF",
      store: "Lima Centro",
      section: "Mostrador de Carnes",
      time: "Hace 30 minutos",
      image: "/placeholder.svg?key=face4",
    },
  ];

  const vipClients = [
    {
      id: 1,
      name: "María González",
      avatar: "MG",
      tier: "Oro",
      points: 15230,
      visits: 287,
      totalSpent: "$45,230",
      lastVisit: "Hace 2 días",
      favoriteSection: "Verduras",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      avatar: "CR",
      tier: "Platino",
      points: 28450,
      visits: 456,
      totalSpent: "$87,650",
      lastVisit: "Hoy",
      favoriteSection: "Bebidas",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 3,
      name: "Ana María López",
      avatar: "AL",
      tier: "Oro",
      points: 12890,
      visits: 215,
      totalSpent: "$38,920",
      lastVisit: "Hace 1 semana",
      favoriteSection: "Panadería",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: 4,
      name: "Juan Martínez",
      avatar: "JM",
      tier: "Plata",
      points: 8765,
      visits: 142,
      totalSpent: "$26,540",
      lastVisit: "Hace 3 días",
      favoriteSection: "Lácteos",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: 5,
      name: "Rosa Fernández",
      avatar: "RF",
      tier: "Platino",
      points: 31200,
      visits: 512,
      totalSpent: "$95,430",
      lastVisit: "Hoy",
      favoriteSection: "Carnes",
      color: "from-red-400 to-red-600",
    },
    {
      id: 6,
      name: "Pedro Sánchez",
      avatar: "PS",
      tier: "Oro",
      points: 14560,
      visits: 278,
      totalSpent: "$42,110",
      lastVisit: "Hace 4 días",
      favoriteSection: "Snacks",
      color: "from-orange-400 to-orange-600",
    },
  ];

  const filteredClients = vipClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Clientes VIP
              </h1>
              <p className="text-muted-foreground mt-2">
                Gestiona y visualiza tus clientes más valiosos
              </p>
            </div>

            <Card className="border border-border bg-linear-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera size={20} className="text-primary" />
                  Caras Detectadas Recientemente
                </CardTitle>
                <CardDescription>
                  Clientes VIP localizados en nuestras sucursales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {detectedFaces.map((face) => (
                    <div
                      key={face.id}
                      className="relative group overflow-hidden rounded-lg border border-border/50 hover:shadow-lg transition-all hover:border-primary/50"
                    >
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={face.image || "/placeholder.svg"}
                          alt={face.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Camera size={12} />
                          Detectado
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-white font-bold text-sm">
                          {face.name}
                        </p>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                          <MapPin size={12} />
                          {face.section}
                        </p>
                        <p className="text-white/60 text-xs">{face.store}</p>
                      </div>

                      <div className="p-3 bg-background">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {face.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {face.section}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          {face.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Buscar Clientes
                </label>
                <Input
                  placeholder="Buscar por nombre o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                Agregar VIP Nuevo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <VIPClientCard key={client.id} client={client} />
              ))}
            </div>

            {filteredClients.length === 0 && (
              <Card className="border border-border">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    No se encontraron clientes VIP que coincidan con tu
                    búsqueda.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Estadísticas del Programa VIP</CardTitle>
                <CardDescription>
                  Resumen de tu programa de lealtad VIP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Miembros VIP Totales", value: vipClients.length },
                    {
                      label: "Categoría Platino",
                      value: vipClients.filter((c) => c.tier === "Platino")
                        .length,
                    },
                    { label: "Puntos Totales", value: "110.5K" },
                    { label: "Gasto Promedio", value: "$56,497" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
