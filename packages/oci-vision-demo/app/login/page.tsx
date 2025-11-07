"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoHeader from "@/components/logo-header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    try {
      // In a real app, you would authenticate against your backend
      if (email && password) {
        // Store auth token or session
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        router.push("/dashboard");
      } else {
        setError("Por favor ingresa correo electrónico y contraseña");
      }
    } catch {
      setError("Inicio de sesión fallido. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Bienvenido de Vuelta</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu panel de control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Credenciales de demostración: cualquier correo y contraseña
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
