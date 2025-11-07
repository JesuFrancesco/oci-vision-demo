"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VIPContent() {
  const vipClients = [
    {
      id: 1,
      name: "María García",
      visits: 156,
      lastVisit: "2 hours ago",
      totalSpent: "$4,230",
      status: "Active",
    },
    {
      id: 2,
      name: "Juan Rodríguez",
      visits: 142,
      lastVisit: "1 day ago",
      totalSpent: "$3,890",
      status: "Active",
    },
    {
      id: 3,
      name: "Carlos López",
      visits: 128,
      lastVisit: "3 days ago",
      totalSpent: "$3,450",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Ana Martínez",
      visits: 115,
      lastVisit: "Today",
      totalSpent: "$2,980",
      status: "Active",
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            VIP Client Faces
          </h2>
          <p className="text-gray-600">
            Facial recognition data for premium customers
          </p>
        </div>

        {/* VIP Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {vipClients.map((client) => (
            <Card
              key={client.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-square bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl font-bold text-primary/20">
                  {client.name.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <span className="text-white font-semibold text-sm">
                    Facial Match: 98%
                  </span>
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="font-semibold text-slate-900">{client.name}</p>
                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <p>
                    Visits:{" "}
                    <span className="font-semibold text-slate-900">
                      {client.visits}
                    </span>
                  </p>
                  <p>
                    Last Visit:{" "}
                    <span className="font-semibold">{client.lastVisit}</span>
                  </p>
                  <p>
                    Total Spent:{" "}
                    <span className="font-semibold text-primary">
                      {client.totalSpent}
                    </span>
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      client.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total VIP Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">892</div>
              <p className="text-xs text-gray-600 mt-1">
                Enrolled in loyalty program
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Recognition Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">96.8%</div>
              <p className="text-xs text-gray-600 mt-1">
                Facial recognition accuracy
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$4,138</div>
              <p className="text-xs text-gray-600 mt-1">
                Per VIP customer (annually)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
