import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockListings, mockLeads } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  RadialBarChart, RadialBar,
} from "recharts";
import { TrendingUp, Users, Building2, BarChart3 } from "lucide-react";

const COLORS = {
  blue: "hsl(217, 91%, 60%)",
  emerald: "hsl(142, 76%, 36%)",
  orange: "hsl(25, 95%, 53%)",
  purple: "hsl(263, 70%, 50%)",
  red: "hsl(0, 84%, 60%)",
  cyan: "hsl(189, 94%, 43%)",
  amber: "hsl(38, 92%, 50%)",
  green: "hsl(142, 71%, 45%)",
};

export function DashboardCharts() {
  const statusData = ["Live", "Draft", "Pending", "Archived", "Pocket"].map((s) => ({
    name: s,
    count: mockListings.filter((l) => l.status === s).length,
  }));

  const communityMap: Record<string, number> = {};
  mockListings.forEach((l) => { communityMap[l.community] = (communityMap[l.community] || 0) + 1; });
  const communityData = Object.entries(communityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, count }));

  const portalData = [
    { name: "Property Finder", value: mockListings.filter((l) => l.portals.pf).length, color: COLORS.green },
    { name: "Bayut", value: mockListings.filter((l) => l.portals.bayut).length, color: COLORS.orange },
    { name: "Website", value: mockListings.filter((l) => l.portals.website).length, color: COLORS.purple },
  ];

  const typeMap: Record<string, number> = {};
  mockListings.forEach((l) => { typeMap[l.type] = (typeMap[l.type] || 0) + 1; });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  const typeColors = [COLORS.blue, COLORS.emerald, COLORS.orange, COLORS.purple, COLORS.red, COLORS.cyan, COLORS.amber];

  // Price Range by Purpose
  const priceData = [
    { range: "< 100K", rent: mockListings.filter((l) => l.purpose === "Rent" && l.price < 100000).length, sale: mockListings.filter((l) => l.purpose === "Sale" && l.price < 100000).length },
    { range: "100K-500K", rent: mockListings.filter((l) => l.purpose === "Rent" && l.price >= 100000 && l.price < 500000).length, sale: mockListings.filter((l) => l.purpose === "Sale" && l.price >= 100000 && l.price < 500000).length },
    { range: "500K-2M", rent: mockListings.filter((l) => l.purpose === "Rent" && l.price >= 500000 && l.price < 2000000).length, sale: mockListings.filter((l) => l.purpose === "Sale" && l.price >= 500000 && l.price < 2000000).length },
    { range: "2M-5M", rent: mockListings.filter((l) => l.purpose === "Rent" && l.price >= 2000000 && l.price < 5000000).length, sale: mockListings.filter((l) => l.purpose === "Sale" && l.price >= 2000000 && l.price < 5000000).length },
    { range: "5M+", rent: mockListings.filter((l) => l.purpose === "Rent" && l.price >= 5000000).length, sale: mockListings.filter((l) => l.purpose === "Sale" && l.price >= 5000000).length },
  ];

  const leadsSourceData = [
    { name: "WhatsApp", value: mockLeads.filter((l) => l.source === "WhatsApp").length, color: COLORS.green },
    { name: "Email", value: mockLeads.filter((l) => l.source === "Email").length, color: COLORS.blue },
    { name: "Call", value: mockLeads.filter((l) => l.source === "Call").length, color: COLORS.orange },
  ];

  const agentMap: Record<string, { total: number; live: number }> = {};
  mockListings.forEach((l) => {
    if (!agentMap[l.listingAgent]) agentMap[l.listingAgent] = { total: 0, live: 0 };
    agentMap[l.listingAgent].total++;
    if (l.status === "Live") agentMap[l.listingAgent].live++;
  });
  const agentData = Object.entries(agentMap).map(([name, d]) => ({
    name,
    total: d.total,
    live: d.live,
    fill: COLORS.blue,
  }));

  const tooltipStyle = {
    contentStyle: {
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      fontSize: "12px",
      color: "hsl(var(--foreground))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Listings by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={[COLORS.emerald, COLORS.amber, COLORS.blue, COLORS.red, COLORS.purple][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Top Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={communityData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={120} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill={COLORS.blue} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Portal Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={portalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {portalData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Property Types
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={typeColors[i % typeColors.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Leads by Source
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={leadsSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {leadsSourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Price Range Area + Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Price Distribution (Rent vs Sale)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="rent" name="Rent" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="sale" name="Sale" stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agentData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="total" name="Total Listings" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
                <Bar dataKey="live" name="Live" fill={COLORS.emerald} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
