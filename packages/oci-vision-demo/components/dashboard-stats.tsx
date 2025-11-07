import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardStats() {
  const stats = [
    { label: "Total Products", value: "2,543", change: "+12%" },
    { label: "Low Stock Items", value: "87", change: "-5%" },
    { label: "VIP Customers", value: "156", change: "+8%" },
    { label: "This Month Sales", value: "$45,231", change: "+23%" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-primary">{stat.change}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
