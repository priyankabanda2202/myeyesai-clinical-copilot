export const DEMO_CASES = [
  {
    id: "crao",
    label: "Emergency — Sudden vision loss (CRAO)",
    name: "Eval-CRAO-01",
    age: 67,
    laterality: "OD",
    visual_acuity: "CF at 2ft OD, 20/25 OS",
    iop: "16 OD / 15 OS mmHg",
    duration: "4 hours",
    comorbidities: "Hypertension, atrial fibrillation",
    symptoms:
      "Sudden painless vision loss in right eye since this morning. Curtain descending over vision. No trauma.",
  },
  {
    id: "aacg",
    label: "Urgent — Acute angle closure",
    name: "Eval-AACG-01",
    age: 54,
    laterality: "OD",
    visual_acuity: "20/200 OD, 20/20 OS",
    iop: "48 OD / 14 OS mmHg",
    duration: "6 hours",
    comorbidities: "Hyperopia",
    symptoms:
      "Severe right eye pain, halos around lights, nausea, blurred vision. Mid-dilated pupil, injected conjunctiva.",
  },
  {
    id: "rd",
    label: "Emergency — Retinal detachment symptoms",
    name: "Eval-RD-01",
    age: 58,
    laterality: "OS",
    visual_acuity: "20/40 OS, 20/20 OD",
    iop: "14 OU mmHg",
    duration: "2 days",
    comorbidities: "High myopia (-8.00 D)",
    symptoms:
      "New floaters and flashing lights for 2 days, now peripheral shadow like a curtain in left eye.",
  },
  {
    id: "routine",
    label: "Routine — Presbyopia / near blur",
    name: "Eval-PRESBY-01",
    age: 42,
    laterality: "OU",
    visual_acuity: "20/20 distance OU, J3 near OU",
    iop: "15 OU mmHg",
    duration: "6 months gradual",
    comorbidities: "None",
    symptoms:
      "Gradual difficulty reading small print over 6 months. No pain, redness, or sudden vision changes.",
  },
] as const;
