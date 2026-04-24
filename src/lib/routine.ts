// Rule-based beauty routine generator. No external AI.
// Pure if/else logic against profile fields.

export type RoutineInput = {
  skinType: string;
  hairType: string;
  concerns: string;
  allergies: string;
};

export type Routine = {
  morning: string[];
  evening: string[];
  notes: string;
};

const lower = (s: string) => (s || "").toLowerCase();
const has = (haystack: string, needle: string) => lower(haystack).includes(needle);

const parseTokens = (s: string): string[] =>
  lower(s)
    .split(/[,;\n]/)
    .map((t) => t.trim())
    .filter(Boolean);

/** Replace any step containing an allergy token with a "skipped" notice. */
const filterAllergies = (steps: string[], allergyTokens: string[]): string[] =>
  steps.map((step) => {
    const offending = allergyTokens.find((tok) => tok && lower(step).includes(tok));
    return offending
      ? `[Skipped: contains ${offending}] — choose an allergy-safe alternative`
      : step;
  });

export function generateRoutine({
  skinType,
  hairType,
  concerns,
  allergies,
}: RoutineInput): Routine {
  const skin = lower(skinType);
  const hair = lower(hairType);
  const c = lower(concerns);
  const allergyTokens = parseTokens(allergies);

  // ---- Cleanser ----
  let cleanser = "Gentle daily cleanser";
  if (skin === "oily" || skin === "combination") cleanser = "Oil-free gel cleanser";
  else if (skin === "dry") cleanser = "Hydrating cream cleanser";
  else if (skin === "sensitive") cleanser = "Fragrance-free gentle cleanser";

  // ---- Moisturizer ----
  let moisturizer = "Daily hydrating moisturizer";
  if (skin === "oily") moisturizer = "Lightweight gel moisturizer";
  else if (skin === "dry") moisturizer = "Rich ceramide moisturizer";
  else if (skin === "sensitive") moisturizer = "Soothing barrier cream";

  // ---- Treatments based on concerns ----
  const morningTreatments: string[] = [];
  const eveningTreatments: string[] = [];

  if (has(c, "acne") || has(c, "breakout")) {
    eveningTreatments.push("Salicylic acid 2% spot treatment");
  }
  if (has(c, "dark spot") || has(c, "hyperpigmentation") || has(c, "uneven")) {
    morningTreatments.push("Vitamin C serum (brightening)");
    eveningTreatments.push("Niacinamide serum to fade dark spots");
  }
  if (has(c, "fine line") || has(c, "wrinkle") || has(c, "aging")) {
    eveningTreatments.push("Retinol 0.3% serum (start 2x/week)");
  }
  if (has(c, "redness") || has(c, "rosacea")) {
    morningTreatments.push("Centella asiatica calming serum");
  }
  if (has(c, "dryness") || has(c, "dehydration")) {
    morningTreatments.push("Hyaluronic acid serum on damp skin");
  }
  if (has(c, "pore") || has(c, "texture")) {
    eveningTreatments.push("Niacinamide 10% serum");
  }
  if (has(c, "dull")) {
    eveningTreatments.push("Gentle AHA exfoliant 2x/week");
  }

  // ---- Hair touchpoint (one weekly evening note) ----
  let hairStep = "Sulfate-free shampoo & conditioner 2-3x/week";
  if (hair === "curly" || hair === "coily") {
    hairStep = "Leave-in conditioner + curl cream after washing";
  } else if (hair === "fine") {
    hairStep = "Volumizing lightweight conditioner, avoid heavy oils";
  } else if (hair === "thick") {
    hairStep = "Deep conditioning hair mask 2x/week";
  } else if (hair === "straight" || hair === "wavy") {
    hairStep = "Smoothing serum on damp ends, heat protectant before styling";
  }

  // ---- Assemble routines ----
  let morning = [
    cleanser,
    ...morningTreatments,
    moisturizer,
    "Broad-spectrum SPF 50 sunscreen",
  ];

  let evening = [
    `Double cleanse: oil cleanser, then ${cleanser.toLowerCase()}`,
    ...eveningTreatments,
    moisturizer,
    hairStep,
  ];

  // ---- Allergy filter ----
  if (allergyTokens.length > 0) {
    morning = filterAllergies(morning, allergyTokens);
    evening = filterAllergies(evening, allergyTokens);
  }

  // ---- Notes ----
  const focusBits: string[] = [];
  if (skinType) focusBits.push(`${skinType.toLowerCase()} skin`);
  if (hairType) focusBits.push(`${hairType.toLowerCase()} hair`);
  let notes = focusBits.length
    ? `Tailored for ${focusBits.join(" and ")}.`
    : "A balanced routine for everyday care.";
  if (concerns.trim()) {
    notes += ` Targeting: ${concerns.trim()}.`;
  }
  if (allergyTokens.length > 0) {
    notes += ` Avoiding: ${allergyTokens.join(", ")}.`;
  }

  return { morning, evening, notes };
}
