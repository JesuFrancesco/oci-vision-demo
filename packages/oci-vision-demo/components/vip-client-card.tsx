import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VIPClient {
  id: number;
  name: string;
  avatar: string;
  tier: string;
  points: number;
  visits: number;
  totalSpent: string;
  lastVisit: string;
  favoriteSection: string;
  color: string;
}

interface VIPClientCardProps {
  client: VIPClient;
}

export default function VIPClientCard({ client }: VIPClientCardProps) {
  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className="border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-24 bg-linear-to-r ${client.color} opacity-80`}></div>
      <CardContent className="pt-0">
        <div className="flex items-start justify-between mb-4 -mt-12 relative">
          <div
            className={`w-20 h-20 rounded-full bg-linear-to-br ${client.color} flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-background`}
          >
            {client.avatar}
          </div>
          <Badge className={getTierColor()}>{client.tier}</Badge>
        </div>

        <h3 className="font-bold text-lg text-foreground mb-1">
          {client.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Last visit: {client.lastVisit}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loyalty Points</span>
            <span className="font-semibold text-primary">
              {client.points.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Visits</span>
            <span className="font-semibold text-foreground">
              {client.visits}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Spent</span>
            <span className="font-semibold text-foreground">
              {client.totalSpent}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Favorite Section</span>
            <span className="font-semibold text-foreground">
              {client.favoriteSection}
            </span>
          </div>
        </div>

        <div className="bg-muted p-2 rounded text-xs text-center text-muted-foreground">
          Cliente VIP desde 2021
        </div>
      </CardContent>
    </Card>
  );
}
