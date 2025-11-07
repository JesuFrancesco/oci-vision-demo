"use client";

import { useRouter, useParams } from "next/navigation";
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
import { ChevronLeft, MapPin, TrendingUp, Clock } from "lucide-react";

interface MarketDetail {
  id: number;
  name: string;
  location: string;
  image: string;
  traffic: number;
  customers: number;
  avgDwellTime: string;
  peakHours: string;
  description: string;
  sections: Array<{
    name: string;
    traffic: number;
    intensity: "low" | "moderate" | "high" | "very-high";
  }>;
}

const MARKETS_DATA: Record<number, MarketDetail> = {
  1: {
    id: 1,
    name: "Lima Centro",
    location: "Av. Central 123, Lima",
    image: "/supermarket-interior-with-customers.jpg",
    traffic: 1250,
    customers: 450,
    avgDwellTime: "22 min",
    peakHours: "2 PM - 5 PM",
    description:
      "Nuestra tienda insignia del centro sirve al corazón de Lima con productos premium y excelente servicio al cliente. Ubicada en el bullicioso centro de la ciudad, este mercado experimenta un tráfico consistentemente alto durante el día.",
    sections: [
      { name: "Entrada", traffic: 1250, intensity: "very-high" },
      { name: "Verduras", traffic: 980, intensity: "high" },
      { name: "Lácteos", traffic: 850, intensity: "high" },
      { name: "Mostrador de Carnes", traffic: 720, intensity: "moderate" },
      { name: "Panadería", traffic: 650, intensity: "moderate" },
      { name: "Bebidas", traffic: 1100, intensity: "high" },
      { name: "Snacks", traffic: 890, intensity: "high" },
      { name: "Caja", traffic: 1200, intensity: "very-high" },
    ],
  },
  2: {
    id: 2,
    name: "San Isidro",
    location: "Calle Principal 456, San Isidro",
    image: "/modern-supermarket-store.jpg",
    traffic: 980,
    customers: 380,
    avgDwellTime: "19 min",
    peakHours: "1 PM - 4 PM",
    description:
      "Nuestra ubicación moderna en San Isidro ofrece una selección curada de bienes premium en un entorno de compras de lujo. Conocida por su diseño elegante y servicio al cliente personalizado.",
    sections: [
      { name: "Entrada", traffic: 980, intensity: "high" },
      { name: "Verduras", traffic: 750, intensity: "moderate" },
      { name: "Lácteos", traffic: 620, intensity: "moderate" },
      { name: "Mostrador de Carnes", traffic: 540, intensity: "moderate" },
      { name: "Panadería", traffic: 480, intensity: "low" },
      { name: "Bebidas", traffic: 820, intensity: "high" },
      { name: "Snacks", traffic: 640, intensity: "moderate" },
      { name: "Caja", traffic: 900, intensity: "high" },
    ],
  },
  3: {
    id: 3,
    name: "Miraflores",
    location: "Paseo Costanero 789, Miraflores",
    image: "/busy-supermarket-checkout-area.jpg",
    traffic: 1450,
    customers: 520,
    avgDwellTime: "25 min",
    peakHours: "11 AM - 2 PM",
    description:
      "Nuestra tienda de la costa de Miraflores es la ubicación más concurrida, atrayendo tanto a locales como a turistas. Presenta una amplia selección de productos internacionales y bienes locales premium.",
    sections: [
      { name: "Entrada", traffic: 1450, intensity: "very-high" },
      { name: "Verduras", traffic: 1200, intensity: "very-high" },
      { name: "Lácteos", traffic: 980, intensity: "high" },
      { name: "Mostrador de Carnes", traffic: 850, intensity: "high" },
      { name: "Panadería", traffic: 780, intensity: "high" },
      { name: "Bebidas", traffic: 1300, intensity: "very-high" },
      { name: "Snacks", traffic: 1000, intensity: "high" },
      { name: "Caja", traffic: 1400, intensity: "very-high" },
    ],
  },
  4: {
    id: 4,
    name: "La Molina",
    location: "Av. Universitaria 321, La Molina",
    image: "/supermarket-produce-section.jpg",
    traffic: 875,
    customers: 310,
    avgDwellTime: "18 min",
    peakHours: "3 PM - 6 PM",
    description:
      "Nuestra ubicación del distrito académico de La Molina sirve a estudiantes y familias con precios competitivos y un enfoque en productos frescos y snacks educativos.",
    sections: [
      { name: "Entrada", traffic: 875, intensity: "high" },
      { name: "Verduras", traffic: 680, intensity: "moderate" },
      { name: "Lácteos", traffic: 520, intensity: "moderate" },
      { name: "Mostrador de Carnes", traffic: 420, intensity: "low" },
      { name: "Panadería", traffic: 380, intensity: "low" },
      { name: "Bebidas", traffic: 750, intensity: "moderate" },
      { name: "Snacks", traffic: 600, intensity: "moderate" },
      { name: "Caja", traffic: 800, intensity: "high" },
    ],
  },
  5: {
    id: 5,
    name: "Surco",
    location: "Av. Velasco Astete 654, Surco",
    image: "/supermarket-retail-store-layout.jpg",
    traffic: 1120,
    customers: 420,
    avgDwellTime: "21 min",
    peakHours: "12 PM - 3 PM",
    description:
      "Nuestra tienda del distrito residencial de Surco se enfoca en compras familiares con una amplia variedad de artículos para el hogar, productos orgánicos y ofertas semanales.",
    sections: [
      { name: "Entrada", traffic: 1120, intensity: "high" },
      { name: "Verduras", traffic: 890, intensity: "high" },
      { name: "Lácteos", traffic: 780, intensity: "high" },
      { name: "Mostrador de Carnes", traffic: 650, intensity: "moderate" },
      { name: "Panadería", traffic: 580, intensity: "moderate" },
      { name: "Bebidas", traffic: 950, intensity: "high" },
      { name: "Snacks", traffic: 820, intensity: "high" },
      { name: "Caja", traffic: 1050, intensity: "high" },
    ],
  },
};

const INTENSITY_COLOR = {
  low: "bg-blue-100 text-blue-800",
  moderate: "bg-green-100 text-green-800",
  high: "bg-yellow-100 text-yellow-800",
  "very-high": "bg-red-100 text-red-800",
};

export default function MarketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const marketId = Number(params.market);
  const market = MARKETS_DATA[marketId];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail") || ""
      : "";

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated || !market) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userEmail={userEmail}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex">
        <DashboardNavigation
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push("/heatmap")}
              className="flex items-center gap-2 -ml-2"
            >
              <ChevronLeft size={20} />
              Volver a Sucursales
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Section */}
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-lg shadow-lg h-96 lg:h-full min-h-96">
                  <img
                    src={market.image || "/placeholder.svg"}
                    alt={market.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Description Panel */}
              <div className="space-y-4">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl">{market.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin size={16} />
                      {market.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground">
                      {market.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground font-semibold">
                          Tráfico Diario
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {market.traffic.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground font-semibold">
                          Clientes
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {market.customers}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">
                            Tiempo Promedio
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {market.avgDwellTime}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                        <TrendingUp
                          size={16}
                          className="text-muted-foreground"
                        />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">
                            Horas Pico
                          </p>
                          <p className="text-xs font-bold text-foreground">
                            {market.peakHours}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Intensidad de Tráfico por Sección</CardTitle>
                <CardDescription>
                  Niveles de tráfico en tiempo real por sección de la tienda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {market.sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">
                          {section.name}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            INTENSITY_COLOR[section.intensity]
                          }`}
                        >
                          {section.intensity === "low"
                            ? "Bajo"
                            : section.intensity === "moderate"
                            ? "Moderado"
                            : section.intensity === "high"
                            ? "Alto"
                            : "Muy Alto"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">
                          {section.traffic}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          visitantes
                        </p>
                      </div>
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(section.traffic / 1450) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
