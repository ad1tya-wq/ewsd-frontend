// ============================================================
// mockData.js — Early Warning Sepsis Detector (EWSD)
// Author: Aditya Sahu · 23BCE0873 · VIT Vellore
// ============================================================

const seed = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };

export const generateVitalHistory = (baseHR, baseMAP, baseTemp, baseSpO2, drift = 0, patientSeed = 1) =>
  Array.from({ length: 24 }, (_, i) => {
    const r = (n) => seed(patientSeed * 100 + i * 7 + n);
    return {
      time: `${String(23 - i).padStart(2, "0")}:00`,
      hr: Math.round(baseHR + drift * i + (r(1) - 0.5) * 12),
      map: Math.round(baseMAP - drift * i * 0.4 + (r(2) - 0.5) * 9),
      temp: parseFloat((baseTemp + drift * i * 0.025 + (r(3) - 0.5) * 0.35).toFixed(1)),
      spo2: Math.min(100, Math.max(82, Math.round(baseSpO2 - drift * i * 0.12 + (r(4) - 0.5) * 2.5))),
    };
  }).reverse();

export const PATIENTS = [
  {
    id: "P001",
    name: "Saket Thota",
    age: 67,
    gender: "M",
    room: "4B",
    admitDate: "2026-03-28",
    physician: "Dr. R. Patel",
    riskScore: 85,
    trend: "up",
    vitals: { hr: 118, map: 72, temp: 38.9, spo2: 92, lactate: 3.8, wbc: 18.2, creatinine: 1.9 },
    history: generateVitalHistory(96, 83, 38.0, 97, 1.3, 1),
    scores: { news2: 8, sirs: 3, sofa: 6 },
    rationale:
      "Persistent tachycardia (HR 118 bpm) combined with hypotension (MAP 72 mmHg), high fever (38.9°C), and deteriorating oxygen saturation (SpO2 92%). Lactate at 3.8 mmol/L is the primary contributor, indicating active tissue hypoperfusion. SOFA score of 6 suggests early multi-organ involvement.",
    factors: [
      "↑↑ Heart Rate: 118 bpm — tachycardia",
      "↓ MAP: 72 mmHg — approaching hypotension",
      "↑ Temperature: 38.9°C — high fever",
      "↓ SpO2: 92% — hypoxia",
      "↑↑ Lactate: 3.8 mmol/L — tissue hypoperfusion",
    ],
  },
  {
    id: "P002",
    name: "Peter Isaac",
    age: 54,
    gender: "F",
    room: "3A",
    admitDate: "2026-03-30",
    physician: "Dr. K. Ahmed",
    riskScore: 62,
    trend: "up",
    vitals: { hr: 98, map: 82, temp: 38.1, spo2: 95, lactate: 2.1, wbc: 14.1, creatinine: 1.2 },
    history: generateVitalHistory(84, 90, 37.3, 97, 0.65, 2),
    scores: { news2: 5, sirs: 2, sofa: 3 },
    rationale:
      "Moderate elevation in inflammatory markers with mild tachycardia and low-grade fever. Rising lactate trend over past 6 hours suggests early metabolic stress. WBC elevation confirms ongoing inflammatory response. Risk trending upward — increased monitoring recommended.",
    factors: [
      "↑ Heart Rate: 98 bpm — mild tachycardia",
      "↑ Temperature: 38.1°C — low-grade fever",
      "↑ WBC: 14.1 K/μL — inflammation",
      "↑ Lactate: 2.1 mmol/L — rising trend",
    ],
  },
  {
    id: "P003",
    name: "Navaneeth H K",
    age: 43,
    gender: "M",
    room: "2C",
    admitDate: "2026-03-31",
    physician: "Dr. L. Nguyen",
    riskScore: 18,
    trend: "down",
    vitals: { hr: 72, map: 95, temp: 37.1, spo2: 98, lactate: 0.9, wbc: 8.4, creatinine: 0.8 },
    history: generateVitalHistory(84, 90, 37.7, 96, -0.45, 3),
    scores: { news2: 2, sirs: 0, sofa: 1 },
    rationale:
      "All clinical parameters within normal physiological ranges. Risk score declining significantly following antibiotic initiation. Lactate normalizing confirms improved tissue perfusion. Continue standard monitoring protocol.",
    factors: [
      "✓ Heart Rate: 72 bpm — normal",
      "✓ MAP: 95 mmHg — stable",
      "✓ Temperature: 37.1°C — afebrile",
      "✓ SpO2: 98% — within range",
      "✓ Lactate: 0.9 mmol/L — normal",
    ],
  },
  {
    id: "P004",
    name: "Guru Charan",
    age: 78,
    gender: "F",
    room: "5D",
    admitDate: "2026-03-29",
    physician: "Dr. R. Patel",
    riskScore: 91,
    trend: "up",
    vitals: { hr: 124, map: 65, temp: 39.2, spo2: 89, lactate: 4.7, wbc: 21.6, creatinine: 2.4 },
    history: generateVitalHistory(103, 80, 38.4, 94, 1.6, 4),
    scores: { news2: 10, sirs: 4, sofa: 8 },
    rationale:
      "CRITICAL: Severe tachycardia, MAP approaching septic shock threshold (65 mmHg), high fever, critically low SpO2 (89%), and lactate at 4.7 mmol/L confirming severe tissue hypoperfusion. Creatinine elevation (2.4 mg/dL) indicates acute kidney injury. SOFA score of 8 — multi-organ dysfunction. Immediate Sepsis Bundle (fluids, antibiotics, cultures) required.",
    factors: [
      "↑↑ Heart Rate: 124 bpm — severe tachycardia",
      "↓↓ MAP: 65 mmHg — septic shock threshold",
      "↑↑ Temperature: 39.2°C — high fever",
      "↓↓ SpO2: 89% — critical hypoxia",
      "↑↑ Lactate: 4.7 mmol/L — severe hypoperfusion",
      "↑↑ Creatinine: 2.4 mg/dL — acute kidney injury",
    ],
  },
  {
    id: "P005",
    name: "Dhruv Ayyagari",
    age: 61,
    gender: "M",
    room: "1A",
    admitDate: "2026-03-31",
    physician: "Dr. K. Ahmed",
    riskScore: 45,
    trend: "stable",
    vitals: { hr: 88, map: 86, temp: 37.8, spo2: 96, lactate: 1.6, wbc: 11.8, creatinine: 1.0 },
    history: generateVitalHistory(86, 88, 37.7, 96, 0.1, 5),
    scores: { news2: 4, sirs: 1, sofa: 2 },
    rationale:
      "Borderline moderate risk. Mild tachycardia and low-grade fever present. Inflammatory markers mildly elevated but stable over the past 12 hours. Close monitoring warranted; no immediate escalation required.",
    factors: [
      "↑ Heart Rate: 88 bpm — mild elevation",
      "↑ Temperature: 37.8°C — low-grade fever",
      "↑ WBC: 11.8 K/μL — mildly elevated",
    ],
  },
  {
    id: "P006",
    name: "Jefflin G L",
    age: 35,
    gender: "F",
    room: "6B",
    admitDate: "2026-04-01",
    physician: "Dr. Aditya Sahu",
    riskScore: 8,
    trend: "down",
    vitals: { hr: 68, map: 92, temp: 36.8, spo2: 99, lactate: 0.7, wbc: 7.2, creatinine: 0.7 },
    history: generateVitalHistory(70, 92, 36.9, 99, -0.05, 6),
    scores: { news2: 0, sirs: 0, sofa: 0 },
    rationale:
      "All clinical parameters within normal range. No sepsis indicators detected. NEWS2 score of 0 confirms low acuity. Standard ward monitoring sufficient.",
    factors: [
      "✓ All vitals within normal range",
      "✓ NEWS2 score: 0",
      "✓ No SIRS criteria met",
      "✓ Lactate: 0.7 mmol/L — normal",
    ],
  },
];

export const INITIAL_ALERTS = [
  {
    id: "AL001",
    patientId: "P004",
    patientName: "Guru Charan",
    room: "5D",
    score: 91,
    time: "09:38:55",
    reason: "Critical SpO2 (89%) + Severe Tachycardia (124 bpm) + MAP at septic shock threshold",
    acknowledged: false,
  },
  {
    id: "AL002",
    patientId: "P001",
    patientName: "Saket Thota",
    room: "4B",
    score: 85,
    time: "09:42:11",
    reason: "Rising HR + Elevated Lactate (3.8 mmol/L) + Hypotension",
    acknowledged: false,
  },
  {
    id: "AL003",
    patientId: "P002",
    patientName: "Peter Isaac",
    room: "3A",
    score: 62,
    time: "09:15:30",
    reason: "Rising risk trend over 6h + Elevated Lactate + Mild tachycardia",
    acknowledged: true,
    ackedBy: "Nurse J. Patel",
    ackedAt: "09:19:04",
  },
];
