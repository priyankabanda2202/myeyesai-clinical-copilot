export const HOSPITAL = {
  name: "VisionFlow Eye Institute",
  tagline: "Advanced Ophthalmology & Retina Care",
  founded: "2012",
  accreditation: "Joint Commission Accredited · AAO Member Institution",
  phone: "+1 (800) 555-EYES",
  email: "care@visionflow-eye.com",
  website: "www.visionflow-eye.com",
  headquarters: "450 Medical Center Drive, Suite 200, Boston, MA 02115",
};

export const BRANCHES = [
  {
    id: "main",
    name: "Main Campus — Boston",
    address: "450 Medical Center Drive, Boston, MA 02115",
    phone: "+1 (617) 555-0100",
    hours: "Mon–Fri 7:00 AM – 8:00 PM · Sat 8:00 AM – 2:00 PM",
    departments: ["Emergency Eye Clinic", "Retina & Vitreous", "Glaucoma", "Cataract Surgery", "Pediatric Ophthalmology"],
    beds: 24,
    status: "Operational",
    lead: "Dr. Sarah Chen, Medical Director",
  },
  {
    id: "north",
    name: "North Shore Clinic",
    address: "88 Harbor View Road, Salem, MA 01970",
    phone: "+1 (978) 555-0200",
    hours: "Mon–Fri 8:00 AM – 6:00 PM",
    departments: ["General Ophthalmology", "OCT Imaging", "Laser Suite", "Optical Center"],
    beds: 8,
    status: "Operational",
    lead: "Dr. James Okonkwo, Site Chief",
  },
  {
    id: "west",
    name: "West Regional Center",
    address: "1200 Wellness Parkway, Worcester, MA 01608",
    phone: "+1 (508) 555-0300",
    hours: "Mon–Fri 7:30 AM – 7:00 PM · Sun 9:00 AM – 1:00 PM (Urgent)",
    departments: ["Urgent Eye Care", "Cornea & External Disease", "Neuro-Ophthalmology", "Clinical Research"],
    beds: 12,
    status: "Operational",
    lead: "Dr. Priya Mehta, Regional Director",
  },
];

export type Branch = (typeof BRANCHES)[number];

export const CURRENT_BRANCH = BRANCHES[0];

export const ABOUT = {
  mission:
    "VisionFlow Eye Institute delivers world-class ophthalmology care through integrated clinical decision support, real-time triage, and AI-assisted workflows — connecting our physicians, technicians, and patients across every campus.",
  stats: [
    { label: "Annual Patient Visits", value: "48,000+" },
    { label: "Board-Certified Ophthalmologists", value: "34" },
    { label: "Campus Locations", value: "3" },
    { label: "Emergency Eye Cases / Year", value: "2,400+" },
  ],
  certifications: [
    "Joint Commission Gold Seal of Approval",
    "HIPAA Compliant Infrastructure",
    "AAO Quality Ophthalmic Care Standards",
    "Meaningful Use Stage 3 EHR Certified",
  ],
};
