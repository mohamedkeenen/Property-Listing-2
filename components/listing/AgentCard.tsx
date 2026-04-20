import { User, Phone, Mail, Award } from "lucide-react";

interface AgentCardProps {
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
}

export function AgentCard({ name, avatar, phone, email }: AgentCardProps) {
  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-xl px-6 py-5 space-y-8 text-center relative overflow-hidden shadow-sm hover:bg-muted/50 transition-all">
      
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Certified Partner</span>
        </div>

        <div className="relative inline-block">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-border/50 ring-8 ring-primary/10 mx-auto transition-transform">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-xl font-black text-foreground uppercase tracking-tight">{name}</h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Certified Advisor</p>
          </div>

          <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-center gap-3 text-muted-foreground group">
              <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-sm font-black tracking-tight text-foreground">{phone || "+971 XXX XXX XXX"}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground group">
              <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-sm font-black tracking-tight lowercase text-foreground">{email || "agent@example.com"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
