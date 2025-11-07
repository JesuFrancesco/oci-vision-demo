"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HeatmapContent() {
  return (
    <div className="flex-1 overflow-auto p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Store Heatmap Analysis
          </h2>
          <p className="text-gray-600">
            Real-time customer movement patterns and traffic density
          </p>
        </div>

        {/* Heatmap Visualization */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Store Traffic Heatmap</CardTitle>
            <CardDescription>
              Visualization of customer density by area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-linear-to-br from-slate-100 to-gray-200 rounded-lg p-8 min-h-96 flex items-center justify-center relative overflow-hidden">
              {/* Heatmap Background */}
              <svg
                className="w-full h-full absolute inset-0"
                viewBox="0 0 800 600"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Store outline */}
                <rect
                  x="50"
                  y="50"
                  width="700"
                  height="500"
                  fill="white"
                  stroke="#ccc"
                  strokeWidth="2"
                />

                {/* Heat zones */}
                <circle
                  cx="150"
                  cy="150"
                  r="80"
                  fill="url(#heatGradient1)"
                  opacity="0.7"
                />
                <circle
                  cx="650"
                  cy="180"
                  r="60"
                  fill="url(#heatGradient1)"
                  opacity="0.6"
                />
                <circle
                  cx="400"
                  cy="350"
                  r="120"
                  fill="url(#heatGradient2)"
                  opacity="0.8"
                />
                <circle
                  cx="250"
                  cy="400"
                  r="70"
                  fill="url(#heatGradient1)"
                  opacity="0.65"
                />

                {/* Gradient definitions */}
                <defs>
                  <radialGradient id="heatGradient1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="70%" stopColor="#f87171" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.3" />
                  </radialGradient>
                  <radialGradient id="heatGradient2">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="1" />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.2" />
                  </radialGradient>
                </defs>

                {/* Labels */}
                <text
                  x="150"
                  y="150"
                  fontSize="12"
                  textAnchor="middle"
                  fill="#333"
                  fontWeight="bold"
                >
                  Entrance
                </text>
                <text
                  x="400"
                  y="360"
                  fontSize="12"
                  textAnchor="middle"
                  fill="#fff"
                  fontWeight="bold"
                >
                  High Traffic
                </text>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Density Levels
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: "#dc2626" }}
                    ></div>
                    <span>Very High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: "#ef4444" }}
                    ></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: "#f87171" }}
                    ></div>
                    <span>Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">5 PM - 7 PM</div>
              <p className="text-xs text-gray-600 mt-1">
                Highest traffic period
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Dwell Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">23 min</div>
              <p className="text-xs text-gray-600 mt-1">
                Average store visit duration
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Popular Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Produce</div>
              <p className="text-xs text-gray-600 mt-1">Most visited section</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
