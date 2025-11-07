interface HeatmapGridProps {
  timeRange: string
}

interface Section {
  id: string
  name: string
  intensity: number
}

export default function HeatmapGrid({ timeRange }: HeatmapGridProps) {
  // Generate heatmap data based on time range
  const generateIntensity = (baseIntensity: number) => {
    const variance = Math.random() * 0.3
    return Math.min(100, baseIntensity + variance * 50)
  }

  const sections: Section[] = [
    { id: "entrance", name: "Entrance", intensity: generateIntensity(45) },
    { id: "produce", name: "Produce", intensity: generateIntensity(75) },
    { id: "dairy", name: "Dairy", intensity: generateIntensity(68) },
    { id: "meat", name: "Meat Counter", intensity: generateIntensity(62) },
    { id: "bakery", name: "Bakery", intensity: generateIntensity(58) },
    { id: "beverages", name: "Beverages", intensity: generateIntensity(82) },
    { id: "snacks", name: "Snacks", intensity: generateIntensity(71) },
    { id: "frozen", name: "Frozen", intensity: generateIntensity(64) },
    { id: "checkout", name: "Checkout", intensity: generateIntensity(95) },
  ]

  const getColor = (intensity: number): string => {
    if (intensity < 30) return "bg-blue-500"
    if (intensity < 60) return "bg-green-500"
    if (intensity < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getOpacity = (intensity: number): string => {
    return `opacity-${Math.round(intensity / 10)}`
  }

  return (
    <div className="space-y-6">
      {/* Store Layout Grid */}
      <div className="grid grid-cols-3 gap-3 bg-muted p-4 rounded-lg border border-border">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`${getColor(section.intensity)} rounded-lg p-4 text-center cursor-pointer transition-all hover:scale-105 text-muted-foreground hover:text-foreground`}
            style={{ opacity: 0.6 + (section.intensity / 100) * 0.4 }}
            title={`${section.name}: ${Math.round(section.intensity)}% traffic`}
          >
            <div className="font-semibold text-sm">{section.name}</div>
            <div className="text-xs mt-1">{Math.round(section.intensity)}%</div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Peak Hours</p>
          <p className="text-lg font-bold text-foreground mt-1">2 PM - 5 PM</p>
        </div>
        <div className="bg-muted p-4 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Average Dwell Time</p>
          <p className="text-lg font-bold text-foreground mt-1">18 min</p>
        </div>
      </div>
    </div>
  )
}
