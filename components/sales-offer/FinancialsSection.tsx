"use client";

import { Card } from "@/components/ui/card";
import { ModernField } from "@/components/ui/modern-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Plus, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialsSectionProps {
  formData: any;
  handleInputChange?: (field: string, value: string) => void;
  handleTableChange: (section: 'preReg' | 'paymentPlan', property: string, value: string, index?: number, subItem?: string) => void;
  removePaymentRow: (index: number) => void;
}

export function FinancialsSection({
  formData,
  handleInputChange,
  handleTableChange,
  removePaymentRow
}: FinancialsSectionProps) {


  return (
    <section className="space-y-8 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black py-1 px-3 rounded-full border bg-rose-500/5 text-rose-500 tracking-widest uppercase">Page 05</span>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">Financial Summary & Acquisition Plan</h2>
        </div>
        <p className="text-xs text-muted-foreground ml-14">Breakdown of registration fees and historical payment milestones.</p>
      </div>

      <div className="space-y-12">
        {/* Pre-Reg Card */}
        <Card className="p-10 border-border/20 bg-card/40 backdrop-blur-sm rounded-4xl shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500"><CreditCard className="h-5 w-5" /></div>
            <h3 className="text-[10px] font-black uppercase tracking-widest">Pre-Registration Costs</h3>
          </div>
          
          <div className="space-y-8">
            {Object.entries(formData.preReg).map(([key, item]: [string, any]) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-1">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-3 ml-1">{item.description}</Label>
                  <div className="h-10 text-sm font-black flex items-center px-4 bg-muted/30 rounded-xl border border-border/20 italic">{item.description}</div>
                </div>
                <ModernField label="Event Date" type="date" icon={Calendar} value={item.date} onChange={(e) => handleTableChange('preReg', 'date', e.target.value, undefined, key)} />

                <ModernField label="Share %" value={item.percentage} onChange={(e) => handleTableChange('preReg', 'percentage', e.target.value, undefined, key)} />
                <ModernField label="Total Amount (AED)" value={item.amount} onChange={(e) => handleTableChange('preReg', 'amount', e.target.value, undefined, key)} />
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Plan Card */}
        <Card className="p-10 border-border/20 bg-card/40 backdrop-blur-sm rounded-4xl shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500"><Calendar className="h-5 w-5" /></div>
            <h3 className="text-[10px] font-black uppercase tracking-widest">Payment Milestone Schedule</h3>
          </div>


          {/* Generator Controls */}
          <div className="flex flex-wrap items-end gap-6 mb-12 p-8 bg-blue-500/5 rounded-4xl border border-blue-500/10">
            <div className="w-full flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/80">Milestone Auto-Generator</span>

            </div>
            
            <div className="w-48">
              <ModernField 
                label="Start Date" 
                type="date"
                icon={Calendar}
                value={formData.paymentPlanStartDate} 
                onChange={(e) => handleInputChange?.('paymentPlanStartDate', e.target.value)}
              />
            </div>

            <div className="w-28">
              <ModernField 
                label="Duration" 
                type="number"
                placeholder="0" 
                icon={Plus}
                value={formData.paymentPlanDuration} 
                onChange={(e) => handleInputChange?.('paymentPlanDuration', e.target.value)} 
              />
            </div>

            <div className="w-44 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block text-blue-600/60">Period Type</Label>

              <div className="flex gap-1 p-1 bg-muted/50 rounded-xl h-14 border border-border/20">
                {['month', 'week'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange?.('paymentPlanPeriodType', type)}
                    className={cn(
                      "flex-1 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all",
                      formData.paymentPlanPeriodType === type ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {type}ly
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <ModernField 
                label="FIRST INSTALL %" 
                type="number"
                placeholder="00" 
                icon={CreditCard}
                value={formData.firstInstallmentPercentage} 
                onChange={(e) => handleInputChange?.('firstInstallmentPercentage', e.target.value)} 
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <ModernField 
                label="LAST INSTALL %" 
                type="number"
                placeholder="00" 
                icon={CreditCard}
                value={formData.lastInstallmentPercentage} 
                onChange={(e) => handleInputChange?.('lastInstallmentPercentage', e.target.value)} 
              />
            </div>


          </div>



          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-5 gap-6 px-4 mb-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              <span className="col-span-1">Due Date</span>
              <span className="col-span-2">Milestone Description</span>
              <span className="col-span-1 text-center">% Ratio</span>
              <span className="col-span-1 text-right">Value (AED)</span>
            </div>
            
            <div className="space-y-4">
              {formData.paymentPlan.map((row: any, idx: number) => (
                <div key={idx} className="group relative grid grid-cols-1 md:grid-cols-5 gap-6 items-center p-4 rounded-4xl hover:bg-primary/5 transition-all">
                  <div className="md:col-span-1"><ModernField label="Date" value={row.date} onChange={(e) => handleTableChange('paymentPlan', 'date', e.target.value, idx)} /></div>
                  <div className="md:col-span-2"><ModernField label="Installment" value={row.installment} onChange={(e) => handleTableChange('paymentPlan', 'installment', e.target.value, idx)} /></div>
                  <div className="md:col-span-1"><ModernField label="Ratio %" value={row.percentage} onChange={(e) => handleTableChange('paymentPlan', 'percentage', e.target.value, idx)} /></div>
                  <div className="md:col-span-1 relative flex items-center gap-4">
                    <ModernField label="Price" value={row.price} onChange={(e) => handleTableChange('paymentPlan', 'price', e.target.value, idx)} />
                    <Button 
                      type="button"
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removePaymentRow(idx)}
                      className="h-10 w-10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
