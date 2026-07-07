import { HOSPITAL, ABOUT } from "@/lib/hospital";
import { Award, Building2, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <div className="glass p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-glow">About Us</p>
        <h2 className="mt-2 text-2xl font-bold text-white">{HOSPITAL.name}</h2>
        <p className="mt-1 text-gold">{HOSPITAL.tagline}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">{ABOUT.mission}</p>
        <p className="mt-4 text-sm text-slate-500">Est. {HOSPITAL.founded} · {HOSPITAL.accreditation}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {ABOUT.stats.map((s) => (
          <div key={s.label} className="metric-card text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="glass p-6">
          <div className="flex items-center gap-2">
            <Heart className="text-live" size={20} />
            <h3 className="font-semibold text-white">Our Mission</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            We combine expert ophthalmology care with real-time clinical decision support to deliver
            faster triage, accurate diagnoses, and seamless coordination across all VisionFlow campuses.
            Every patient receives the right level of care at the right time.
          </p>
        </div>
        <div className="glass p-6">
          <div className="flex items-center gap-2">
            <Award className="text-gold" size={20} />
            <h3 className="font-semibold text-white">Accreditations</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {ABOUT.certifications.map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass p-6">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-accent-glow" />
          <h3 className="font-semibold text-white">VisionFlow Clinical Copilot</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Our integrated clinical intelligence platform powers real-time triage, automated documentation,
          and AI-assisted reasoning across {ABOUT.stats[2].value} campus locations. Built for ophthalmologists,
          technicians, and clinical staff — deployed hospital-wide since 2024.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Users size={16} />
          {ABOUT.stats[1].value} physicians · {ABOUT.stats[0].value} annual visits
        </div>
      </div>
    </div>
  );
}
