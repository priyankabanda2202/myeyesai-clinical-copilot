import Link from "next/link";
import { HOSPITAL } from "@/lib/hospital";

export default function AppFooter() {
  return (
    <footer className="mt-12 border-t border-border/40 pt-6 pb-4">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-semibold text-white">{HOSPITAL.name}</p>
          <p className="mt-1 text-xs text-slate-500">{HOSPITAL.headquarters}</p>
          <p className="mt-1 text-xs text-slate-500">{HOSPITAL.phone} · {HOSPITAL.email}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs text-slate-400">
          <Link href="/about/" className="hover:text-white">About Us</Link>
          <Link href="/branches/" className="hover:text-white">Locations</Link>
          <Link href="/compliance/" className="hover:text-white">Privacy & Security</Link>
          <Link href="/help/" className="hover:text-white">Help Desk</Link>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-slate-600">
        © {new Date().getFullYear()} {HOSPITAL.name}. {HOSPITAL.accreditation}. All rights reserved.
      </p>
    </footer>
  );
}
