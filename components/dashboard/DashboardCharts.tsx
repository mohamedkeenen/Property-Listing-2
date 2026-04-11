import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLeads, PropertyListing, Lead } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useGetLeadsQuery } from "@/api/redux/services/leadsApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import { TrendingUp, Users, Building2, BarChart3, MessageCircle, Mail, Phone, Globe, Loader2 } from "lucide-react";
import NextImage from "next/image";

const COLORS = {
  blue: "#3b82f6",
  emerald: "#28b16d", // Bayut green
  orange: "#ea3934", // PF red-orange
  purple: "#8b5cf6",
  red: "#ef4444",
  cyan: "#06b6d4", // Website cyan
  amber: "#f59e0b",
  green: "#22c55e",
  skyloov: "#006bec",
};

export function DashboardCharts({ listings }: { listings: PropertyListing[] }) {
  const { data: apiLeads, isLoading: leadsLoading } = useGetLeadsQuery({});
  const leads: Lead[] = apiLeads?.leads || [];

  const statusData = ["Live", "Draft", "Pending", "Archived", "Pocket"].map((s) => ({
    name: s,
    count: listings.filter((l) => l.status === s).length,
  }));

  const communityMap: Record<string, number> = {};
  listings.forEach((l) => { communityMap[l.community] = (communityMap[l.community] || 0) + 1; });
  const allCommunities = Object.entries(communityMap).sort((a, b) => b[1] - a[1]);

  const [showAllCommunities, setShowAllCommunities] = useState(false);
  
  const communityData = allCommunities
    .slice(0, showAllCommunities ? 20 : 6)
    .map(([name, count]) => ({ name, count }));

  const portalData = [
    { 
      name: "Property Finder", 
      value: listings.filter((l) => l.portals.pf).length, 
      color: COLORS.orange,
      breakdown: ["Apartment", "Villa", "Office", "Townhouse"].map(t => ({
        name: t,
        value: listings.filter(l => l.portals.pf && l.type === t).length
      })).filter(i => i.value > 0)
    },
    { 
      name: "Bayut", 
      value: listings.filter((l) => l.portals.bayut).length, 
      color: COLORS.emerald,
      breakdown: ["Apartment", "Villa", "Office", "Townhouse"].map(t => ({
        name: t,
        value: listings.filter(l => l.portals.bayut && l.type === t).length
      })).filter(i => i.value > 0)
    },
    { 
      name: "Website", 
      value: listings.filter((l) => l.portals.website).length, 
      color: COLORS.cyan,
      breakdown: ["Apartment", "Villa", "Office", "Townhouse"].map(t => ({
        name: t,
        value: listings.filter(l => l.portals.website && l.type === t).length
      })).filter(i => i.value > 0)
    },
    { 
      name: "Facebook", 
      value: listings.filter((l) => l.portals.website && false).length, // Placeholder logic or based on leads if you want
      color: COLORS.blue,
      breakdown: []
    },
  ];

  const typeMap: Record<string, number> = {};
  listings.forEach((l) => { typeMap[l.type] = (typeMap[l.type] || 0) + 1; });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  const typeColors = [COLORS.blue, COLORS.emerald, COLORS.orange, COLORS.purple, COLORS.red, COLORS.cyan, COLORS.amber];

  const priceData = [
    { range: "< 100K", rent: listings.filter((l) => l.purpose === "Rent" && l.price < 100000).length, sale: listings.filter((l) => l.purpose === "Sale" && l.price < 100000).length },
    { range: "100K-500K", rent: listings.filter((l) => l.purpose === "Rent" && l.price >= 100000 && l.price < 500000).length, sale: listings.filter((l) => l.purpose === "Sale" && l.price >= 100000 && l.price < 500000).length },
    { range: "500K-2M", rent: listings.filter((l) => l.purpose === "Rent" && l.price >= 500000 && l.price < 2000000).length, sale: listings.filter((l) => l.purpose === "Sale" && l.price >= 500000 && l.price < 2000000).length },
    { range: "2M-5M", rent: listings.filter((l) => l.purpose === "Rent" && l.price >= 2000000 && l.price < 5000000).length, sale: listings.filter((l) => l.purpose === "Sale" && l.price >= 2000000 && l.price < 5000000).length },
    { range: "5M+", rent: listings.filter((l) => l.purpose === "Rent" && l.price >= 5000000).length, sale: listings.filter((l) => l.purpose === "Sale" && l.price >= 5000000).length },
  ];

  const leadsSourceData = [
    { 
      name: "WhatsApp", 
      value: leads.filter((l: any) => (l.sub_source || l.subSource) === "WhatsApp").length, 
      color: COLORS.green,
      breakdown: ["Property Finder", "Bayut", "Website", "Facebook"].map(p => ({
        name: p,
        value: leads.filter((l: any) => (l.sub_source || l.subSource) === "WhatsApp" && l.source === p).length
      })).filter(i => i.value > 0)
    },
    { 
      name: "Email", 
      value: leads.filter((l: any) => (l.sub_source || l.subSource) === "Email").length, 
      color: COLORS.blue,
      breakdown: ["Property Finder", "Bayut", "Website", "Facebook"].map(p => ({
        name: p,
        value: leads.filter((l: any) => (l.sub_source || l.subSource) === "Email" && l.source === p).length
      })).filter(i => i.value > 0)
    },
    { 
      name: "Call", 
      value: leads.filter((l: any) => (l.sub_source || l.subSource) === "Call").length, 
      color: COLORS.orange,
      breakdown: ["Property Finder", "Bayut", "Facebook", "Skyloov", "Website"].map(p => ({
        name: p,
        value: leads.filter((l: any) => (l.sub_source || l.subSource) === "Call" && l.source === p).length
      })).filter(i => i.value > 0)
    },
  ];

  const agentMap: Record<string, { total: number; live: number }> = {};
  listings.forEach((l) => {
    if (!agentMap[l.listingAgent]) agentMap[l.listingAgent] = { total: 0, live: 0 };
    agentMap[l.listingAgent].total++;
    if (l.status === "Live") agentMap[l.listingAgent].live++;
  });
  const agentData = Object.entries(agentMap).map(([name, d]) => ({
    name,
    total: d.total,
    live: d.live,
  }));

  const portalLogos: Record<string, string> = {
    "Property Finder": "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/PF_ljkahc.png",
    "Bayut": "https://res.cloudinary.com/devht0mp5/image/upload/v1772105511/bayut_gy4ev2.png",
    "Skyloov": "https://res.cloudinary.com/devht0mp5/image/upload/v1773486432/Logo-rebrand-blue_dwxrba.svg",
    "Facebook": "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  };

  const channelIcons: Record<string, any> = {
    "WhatsApp": MessageCircle,
    "Email": Mail,
    "Call": Phone,
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPie = !label;
      const name = isPie ? data.name : label;
      const breakdown = data.breakdown;
      
      return (
        <div className="bg-slate-950/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 min-w-[160px]">
          <div className="flex items-center gap-4">
            {portalLogos[name] ? (
              <div className="relative h-7 w-20 shrink-0 bg-white/5 rounded-lg p-1 transition-colors">
                 <NextImage 
                   src={portalLogos[name]} 
                   alt={name} 
                   fill 
                   className="object-contain p-0.5" 
                   priority
                 />
              </div>
            ) : channelIcons[name] ? (
              (() => {
                const Icon = channelIcons[name];
                return <div className="p-2 bg-primary/10 rounded-lg"><Icon className="h-5 w-5 text-primary" /></div>;
              })()
            ) : name === "Website" ? (
              <div className="p-2 bg-cyan-500/10 rounded-lg"><Globe className="h-5 w-5 text-cyan-500" /></div>
            ) : (
              <div className="h-3 w-3 rounded-full shadow-sm ring-2 ring-white/10" style={{ backgroundColor: payload[0].color || payload[0].fill }} />
            )}
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{name}</span>
              <span className="text-sm font-bold text-white">
                {typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}
              </span>
            </div>
          </div>

          {breakdown && breakdown.length > 0 && (
            <div className="border-t border-white/5 pt-3 mt-1 space-y-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Detailed Breakdown</p>
              <div className="grid grid-cols-1 gap-1.5">
                {breakdown.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-4 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                       {portalLogos[item.name] ? (
                         <div className="relative h-3.5 w-10 shrink-0 opacity-90">
                            <NextImage src={portalLogos[item.name]} alt={item.name} fill className="object-contain" />
                         </div>
                       ) : item.name === "Website" ? (
                         <div className="w-10 flex justify-center shrink-0">
                           <Globe className="h-3.5 w-3.5 text-cyan-500" />
                         </div>
                       ) : (
                         <div className="w-10 flex justify-center shrink-0">
                           <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                         </div>
                       )}
                       <span className="text-[10px] font-medium text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const tooltipStyle = {
    content: <CustomTooltip />,
    cursor: { fill: 'var(--muted)', opacity: 0.1 }
  };

  const cardClass = "bg-card border border-border/40 rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-primary/20";
  const labelClass = "text-lg font-black text-foreground flex items-center gap-3 capitalize tracking-tight";

  return (
    <div className="space-y-8 min-w-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={cn(cardClass, "lg:col-span-1 min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              Inventory Status Distribution
            </CardTitle>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md">
              {listings.length} Total
            </div>
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
                    <Cell key={i} fill={[COLORS.emerald, COLORS.amber, COLORS.blue, COLORS.red, COLORS.purple][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "lg:col-span-1 min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <Building2 className="h-4 w-4 text-blue-500" />
              Market Design By Community
            </CardTitle>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAllCommunities(!showAllCommunities)}
                className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-md hover:bg-primary/20 transition-colors"
              >
                {showAllCommunities ? "Show Less" : "See All"}
              </button>
              <div className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">
                {listings.length} Total
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-6 px-6">
            <ResponsiveContainer width="100%" height={showAllCommunities ? 600 : 280}>
              <BarChart data={communityData} layout="vertical" barSize={20} margin={{ left: 40, right: 20 }}>
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
                  tick={{ fontSize: 11, fill: "var(--foreground)", fontWeight: "600" }} 
                  width={160} 
                  dx={-10}
                />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                <Bar dataKey="count" radius={[2, 8, 8, 2]} fill={COLORS.blue} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className={cn(cardClass, "min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <TrendingUp className="h-4 w-4 text-primary" />
              Listing Portals
            </CardTitle>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-md">
              {portalData.reduce((acc, curr) => acc + curr.value, 0)} Total
            </div>
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
                  formatter={(value) => (
                    <span 
                      style={{ color: "var(--foreground)" }} 
                      className={cn("transition-opacity", value === "Skyloov" && "opacity-40")}
                    >
                      {value} {value === "Skyloov" && <span className="text-[8px] font-black bg-primary/20 px-1 rounded ml-1">SOON</span>}
                    </span>
                  )}
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingTop: "20px" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <Building2 className="h-4 w-4 text-purple-500" />
              Structure Types
            </CardTitle>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-500 px-2 py-1 rounded-md">
              {listings.length} Total
            </div>
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
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingTop: "20px" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <Users className="h-4 w-4 text-orange-500" />
              Inquiry Sources
            </CardTitle>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md">
              {leads.length} Total
            </div>
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
                  formatter={(value, entry: any) => {
                    const data = entry.payload;
                    return (
                      <span style={{ color: "var(--foreground)" }} className="text-[10px] font-bold">
                        {value} ({data.value})
                      </span>
                    );
                  }}
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingTop: "20px" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={cn(cardClass, "min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Rent & Sale
            </CardTitle>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">
              {listings.length} Total
            </div>
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
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingBottom: "20px" }} 
                />
                <Area type="monotone" dataKey="sale" name="Sale" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.15} strokeWidth={3} />
                <Area type="monotone" dataKey="rent" name="Rent" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.15} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "min-w-0")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 bg-muted/10 border-b border-border/20 space-y-0">
            <CardTitle className={labelClass}>
              <Users className="h-4 w-4 text-blue-500" />
              Team Performance
            </CardTitle>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">
              {listings.length} Total
            </div>
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
                   wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingBottom: "20px" }} 
                />
                <Bar dataKey="live" name="Live" fill={COLORS.emerald} radius={[6, 6, 2, 2]} />
                <Bar dataKey="total" name="Total" fill={COLORS.blue} radius={[6, 6, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
