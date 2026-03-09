"use client";

import { useState } from "react";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { mockLeads } from "@/data/mockData";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

export default function Leads() {
  const totalLeads = mockLeads.length;
  const newLeads = mockLeads.filter((l) => l.status === "New").length;
  const qualifiedLeads = mockLeads.filter((l) => l.status === "Qualified").length;
  const lostLeads = mockLeads.filter((l) => l.status === "Lost").length;

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "New", value: newLeads, icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Qualified", value: qualifiedLeads, icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Lost", value: lostLeads, icon: UserX, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leads</h1>
        <p className="text-sm text-muted-foreground">Manage your property inquiry leads</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <LeadsTable />
    </div>
  );
}
