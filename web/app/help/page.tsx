import { HOSPITAL } from "@/lib/hospital";
import { Headphones, Mail, Phone, BookOpen } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-white">Clinical Help Desk</h2>
        <p className="mt-1 text-sm text-slate-400">IT support and clinical workflow assistance</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        {[
          { icon: Phone, title: "24/7 Support Line", value: HOSPITAL.phone, desc: "Clinical & technical support" },
          { icon: Mail, title: "Email Support", value: HOSPITAL.email, desc: "Non-urgent requests · 4hr SLA" },
          { icon: Headphones, title: "On-Call IT", value: "Ext. 4400", desc: "System outages & access issues" },
        ].map(({ icon: Icon, title, value, desc }) => (
          <div key={title} className="glass p-5">
            <Icon size={20} className="text-accent-glow" />
            <p className="mt-3 font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-live">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="glass p-6">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-gold" />
          <h3 className="font-semibold text-white">Quick Reference</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li><strong className="text-white">Patient Intake:</strong> Enter presentation → Run Automated Pipeline → Review → Attest</li>
          <li><strong className="text-white">Emergency cases:</strong> Auto-routed to same-day slot on Live Triage Board</li>
          <li><strong className="text-white">Reports:</strong> Download or print from Reports module after physician review</li>
          <li><strong className="text-white">Clinical Assistant:</strong> Real-time case Q&A — available 24/7 across all campuses</li>
          <li><strong className="text-white">Audit Trail:</strong> All actions logged for compliance and quality review</li>
        </ul>
      </div>
    </div>
  );
}
