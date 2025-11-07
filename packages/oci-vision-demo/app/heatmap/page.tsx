"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNavigation from "@/components/dashboard-navigation";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface Market {
  id: number;
  name: string;
  location: string;
  image: string;
  traffic: number;
  customers: number;
}

const MARKETS: Market[] = [
  {
    id: 1,
    name: "Lima Centro",
    location: "Av. Central 123",
    image: "/supermarket-interior-with-customers.jpg",
    traffic: 1250,
    customers: 450,
  },
  {
    id: 2,
    name: "San Isidro",
    location: "Calle Principal 456",
    image: "/modern-supermarket-store.jpg",
    traffic: 980,
    customers: 380,
  },
  {
    id: 3,
    name: "Miraflores",
    location: "Paseo Costanero 789",
    image: "/busy-supermarket-checkout-area.jpg",
    traffic: 1450,
    customers: 520,
  },
  {
    id: 4,
    name: "La Molina",
    location: "Av. Universitaria 321",
    image: "/supermarket-produce-section.jpg",
    traffic: 875,
    customers: 310,
  },
  {
    id: 5,
    name: "Surco",
    location: "Av. Velasco Astete 654",
    image: "/supermarket-retail-store-layout.jpg",
    traffic: 1120,
    customers: 420,
  },
];

export default function HeatmapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail") || ""
      : "";

  const filteredMarkets = MARKETS.filter(
    (market) =>
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredMarkets.length / itemsPerPage);
  const paginatedMarkets = filteredMarkets.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % MARKETS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + MARKETS.length) % MARKETS.length);
  };

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
                Análisis de Mapa de Calor
              </h1>
              <p className="text-muted-foreground mt-2">
                Selecciona una sucursal para ver análisis detallado del mapa de
                calor
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Sucursales Destacadas
              </h2>
              <div className="relative bg-muted rounded-lg overflow-hidden">
                <div className="relative h-80 flex items-center">
                  {MARKETS.map((market, idx) => (
                    <div
                      key={market.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        idx === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={market.image || "/placeholder.svg"}
                        alt={market.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold">{market.name}</h3>
                        <p className="text-sm opacity-90 flex items-center gap-1">
                          <MapPin size={16} />
                          {market.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {MARKETS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentSlide ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={() =>
                  router.push(`/heatmap/${MARKETS[currentSlide].id}`)
                }
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Ver Mapa de Calor de {MARKETS[currentSlide].name}
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Todas las Sucursales
              </h2>
              <Input
                placeholder="Buscar sucursales por nombre o ubicación..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedMarkets.map((market) => (
                  <Card
                    key={market.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => router.push(`/heatmap/${market.id}`)}
                  >
                    <div className="h-40 overflow-hidden bg-muted">
                      <img
                        src={market.image || "/placeholder.svg"}
                        alt={market.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-lg text-foreground">
                        {market.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin size={14} />
                        {market.location}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Tráfico Diario
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {market.traffic.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Clientes
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {market.customers}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Button
                      key={idx}
                      variant={currentPage === idx ? "default" : "outline"}
                      onClick={() => setCurrentPage(idx)}
                      className={
                        currentPage === idx
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {idx + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}

              {filteredMarkets.length === 0 && (
                <Card className="border border-border">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      No se encontraron sucursales que coincidan con tu
                      búsqueda.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
