import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockListings, mockLeads } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import { TrendingUp, Users, Building2, BarChart3 } from "lucide-react";

const COLORS = {
  blue: "#3b82f6",
  emerald: "#10b981",
  orange: "#f59e0b",
  purple: "#8b5cf6",
  red: "#ef4444",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  green: "#22c55e",
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
  }));

  const tooltipStyle = {
    contentStyle: {
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      fontSize: "10px",
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--foreground)",
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)",
    },
    itemStyle: {
      color: "var(--foreground)",
    }
  };

  const cardClass = "bg-card border border-border/40 rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-primary/20";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              Inventory Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6 px-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontWeight: "900", letterSpacing: "0.05em" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: "700" }} 
                  allowDecimals={false} 
                />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                <Bar dataKey="count" radius={[8, 8, 2, 2]}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={[COLORS.emerald, COLORS.orange, COLORS.blue, COLORS.red, COLORS.purple][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <Building2 className="h-4 w-4 text-blue-500" />
              Market Density by Community
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6 px-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={communityData} layout="vertical" barSize={20} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: "700" }} 
                  allowDecimals={false} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "var(--foreground)", fontWeight: "900", letterSpacing: "0.02em" }} 
                  width={100} 
                  dx={-5}
                />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                <Bar dataKey="count" radius={[2, 8, 8, 2]} fill={COLORS.blue} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <TrendingUp className="h-4 w-4 text-primary" />
              Listing Portals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={portalData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {portalData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend 
                  iconType="circle" 
                  iconSize={10} 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
                  wrapperStyle={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "20px" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <Building2 className="h-4 w-4 text-purple-500" />
              Structure Types
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={typeColors[i % typeColors.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend 
                  iconType="circle" 
                  iconSize={10} 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
                  wrapperStyle={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "20px" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <Users className="h-4 w-4 text-orange-500" />
              Inquiry Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={leadsSourceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {leadsSourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend 
                  iconType="circle" 
                  iconSize={10} 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
                  wrapperStyle={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "20px" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Pricing Dynamics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6 px-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="range" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontWeight: "900", letterSpacing: "0.05em" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: "700" }} 
                  allowDecimals={false} 
                />
                <Tooltip {...tooltipStyle} />
                <Legend 
                  verticalAlign="top"
                  align="right"
                  iconType="circle" 
                  iconSize={8} 
                  formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
                  wrapperStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", paddingBottom: "20px" }} 
                />
                <Area type="monotone" dataKey="rent" name="Leasing" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.15} strokeWidth={3} />
                <Area type="monotone" dataKey="sale" name="Acquisition" stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.15} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20">
            <CardTitle className={labelClass}>
              <Users className="h-4 w-4 text-blue-500" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6 px-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={agentData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)", fontWeight: "900", letterSpacing: "0.05em" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontWeight: "700" }} 
                  allowDecimals={false} 
                />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                <Legend 
                   verticalAlign="top"
                   align="right"
                   iconType="circle" 
                   iconSize={8} 
                   formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
                   wrapperStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", paddingBottom: "20px" }} 
                />
                <Bar dataKey="total" name="Total" fill={COLORS.blue} radius={[6, 6, 2, 2]} />
                <Bar dataKey="live" name="Active" fill={COLORS.emerald} radius={[6, 6, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
