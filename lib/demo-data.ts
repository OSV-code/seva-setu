import { TestPackage } from "@/lib/domain";

export const TEST_PACKAGES: TestPackage[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "General health screen for infection, anemia, and inflammation.",
    price: 499,
    sampleType: "blood",
    prepInstructions: "No fasting needed. Drink water before sample collection.",
  },
  {
    id: "thyroid-profile",
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Checks thyroid function for metabolism and energy balance.",
    price: 899,
    sampleType: "blood",
    prepInstructions: "Morning sample preferred. Share current medication details.",
  },
  {
    id: "diabetes-panel",
    name: "Diabetes Panel (FBS, PPBS, HbA1c)",
    description: "Comprehensive sugar profile for diagnosis and trend tracking.",
    price: 1199,
    sampleType: "blood",
    prepInstructions: "8-10 hours fasting needed for fasting blood sugar.",
  },
  {
    id: "full-body-checkup",
    name: "Full Body Checkup",
    description: "Broad screening package covering CBC, lipids, sugar, liver, and kidney.",
    price: 2499,
    sampleType: "blood",
    prepInstructions: "10-12 hours fasting recommended for best accuracy.",
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen Wellness Package",
    description: "Curated preventive panel for elders with key vitals and blood markers.",
    price: 1799,
    sampleType: "blood",
    prepInstructions: "Keep medicine list handy for technician verification.",
  },
  {
    id: "urine-routine",
    name: "Urine Routine & Microscopy",
    description: "Detects urinary tract and kidney related abnormalities.",
    price: 349,
    sampleType: "urine",
    prepInstructions: "Collect first morning mid-stream sample when possible.",
  },
];

export const TIME_WINDOWS = [
  "7:00-9:00",
  "9:00-11:00",
  "11:00-13:00",
  "16:00-18:00",
] as const;
