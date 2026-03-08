// src/lib/trades.ts
export type Trade =
  | "Plumber"
  | "Electrician"
  | "Handyman"
  | "Landscaper"
  | "Tattoo Artist"
  | "Other";

export const TRADES: Trade[] = [
  "Plumber",
  "Electrician",
  "Handyman",
  "Landscaper",
  "Tattoo Artist",
  "Other",
];

export interface Material {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  quantity: number;
  isCustom?: boolean;
}

let _counter = 0;
export function genId(prefix = "mat"): string {
  _counter += 1;
  return `${prefix}_${Date.now()}_${_counter}`;
}

const PLUMBER_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "½″ Copper Pipe", unit: "ft", costPerUnit: 3.5 },
  { name: "¾″ Copper Pipe", unit: "ft", costPerUnit: 4.8 },
  { name: "1″ Copper Pipe", unit: "ft", costPerUnit: 7.2 },
  { name: "½″ Ball Valve", unit: "each", costPerUnit: 12.5 },
  { name: "¾″ Ball Valve", unit: "each", costPerUnit: 18.0 },
  { name: "½″ Elbow (Copper)", unit: "each", costPerUnit: 2.1 },
  { name: "¾″ Elbow (Copper)", unit: "each", costPerUnit: 3.4 },
  { name: "½″ Tee (Copper)", unit: "each", costPerUnit: 3.0 },
  { name: "P-Trap (1½″)", unit: "each", costPerUnit: 8.5 },
  { name: "Wax Ring", unit: "each", costPerUnit: 6.0 },
  { name: "Supply Line (12″)", unit: "each", costPerUnit: 5.5 },
  { name: "Teflon Tape", unit: "roll", costPerUnit: 1.2 },
  { name: "Pipe Solder", unit: "oz", costPerUnit: 0.8 },
  { name: "Flux", unit: "oz", costPerUnit: 2.5 },
  { name: "PVC Pipe (½″)", unit: "ft", costPerUnit: 0.6 },
  { name: "PVC Primer", unit: "can", costPerUnit: 6.0 },
  { name: "PVC Cement", unit: "can", costPerUnit: 7.0 },
];

const ELECTRICIAN_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "14/2 Romex Wire", unit: "ft", costPerUnit: 0.55 },
  { name: "12/2 Romex Wire", unit: "ft", costPerUnit: 0.75 },
  { name: "10/2 Romex Wire", unit: "ft", costPerUnit: 1.1 },
  { name: "Single-Gang Box", unit: "each", costPerUnit: 1.8 },
  { name: "Double-Gang Box", unit: "each", costPerUnit: 2.5 },
  { name: "15A Outlet (Duplex)", unit: "each", costPerUnit: 3.5 },
  { name: "20A Outlet (Duplex)", unit: "each", costPerUnit: 5.0 },
  { name: "GFCI Outlet 15A", unit: "each", costPerUnit: 16.0 },
  { name: "GFCI Outlet 20A", unit: "each", costPerUnit: 22.0 },
  { name: "Single-Pole Switch", unit: "each", costPerUnit: 3.0 },
  { name: "3-Way Switch", unit: "each", costPerUnit: 7.5 },
  { name: "15A Breaker", unit: "each", costPerUnit: 8.0 },
  { name: "20A Breaker", unit: "each", costPerUnit: 9.5 },
  { name: "Wire Connectors (Bag)", unit: "bag", costPerUnit: 4.0 },
  { name: "Electrical Tape", unit: "roll", costPerUnit: 1.5 },
  { name: "Conduit (½″ EMT)", unit: "ft", costPerUnit: 0.9 },
  { name: "Cable Staples (Box)", unit: "box", costPerUnit: 5.0 },
];

const HANDYMAN_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "Drywall Sheet (4×8)", unit: "sheet", costPerUnit: 14.0 },
  { name: "Joint Compound (5gal)", unit: "bucket", costPerUnit: 22.0 },
  { name: "Drywall Tape (75ft)", unit: "roll", costPerUnit: 4.5 },
  { name: "Drywall Screws (1lb)", unit: "lb", costPerUnit: 5.0 },
  { name: "2×4 Stud (8ft)", unit: "each", costPerUnit: 4.5 },
  { name: "2×6 (8ft)", unit: "each", costPerUnit: 7.0 },
  { name: "Wood Screws (1lb)", unit: "lb", costPerUnit: 6.0 },
  { name: "Construction Adhesive", unit: "tube", costPerUnit: 5.5 },
  { name: "Caulk (Paintable)", unit: "tube", costPerUnit: 3.5 },
  { name: "Paint (Interior, 1gal)", unit: "gal", costPerUnit: 32.0 },
  { name: "Primer (1gal)", unit: "gal", costPerUnit: 25.0 },
  { name: "Paint Roller (9″)", unit: "each", costPerUnit: 8.0 },
  { name: "Sandpaper (Pack)", unit: "pack", costPerUnit: 7.0 },
  { name: "Door Hinge (Pair)", unit: "pair", costPerUnit: 6.5 },
  { name: "Door Handle Set", unit: "each", costPerUnit: 35.0 },
  { name: "Anchor Kit", unit: "pack", costPerUnit: 8.0 },
];

const LANDSCAPER_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "Mulch (2 cu ft bag)", unit: "bag", costPerUnit: 6.5 },
  { name: "Topsoil (40 lb bag)", unit: "bag", costPerUnit: 5.5 },
  { name: "Fertilizer (50 lb)", unit: "bag", costPerUnit: 28.0 },
  { name: "Grass Seed (5 lb)", unit: "bag", costPerUnit: 22.0 },
  { name: "Sod", unit: "sq ft", costPerUnit: 0.65 },
  { name: "Decorative Rock (50lb)", unit: "bag", costPerUnit: 8.0 },
  { name: "Edging (20ft)", unit: "roll", costPerUnit: 14.0 },
  { name: "Landscape Fabric (4×50)", unit: "roll", costPerUnit: 22.0 },
  { name: "Annuals (Flat of 18)", unit: "flat", costPerUnit: 24.0 },
  { name: "Perennial Plant (1gal)", unit: "each", costPerUnit: 12.0 },
  { name: "Shrub (3gal)", unit: "each", costPerUnit: 28.0 },
  { name: "Tree (15gal)", unit: "each", costPerUnit: 120.0 },
  { name: "Irrigation Drip Line (ft)", unit: "ft", costPerUnit: 0.35 },
  { name: "Spray Nozzle", unit: "each", costPerUnit: 4.5 },
  { name: "Weed Killer (Conc 32oz)", unit: "bottle", costPerUnit: 18.0 },
  { name: "Concrete Pavers (each)", unit: "each", costPerUnit: 2.8 },
];

const TATTOO_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "Black Ink (1oz)", unit: "bottle", costPerUnit: 8.0 },
  { name: "Color Ink (1oz)", unit: "bottle", costPerUnit: 9.5 },
  { name: "Tattoo Needles (Box)", unit: "box", costPerUnit: 22.0 },
  { name: "Cartridge Needles (Box)", unit: "box", costPerUnit: 28.0 },
  { name: "Gloves (Box of 100)", unit: "box", costPerUnit: 14.0 },
  { name: "Cling Wrap (Roll)", unit: "roll", costPerUnit: 6.0 },
  { name: "Aftercare Ointment (2oz)", unit: "each", costPerUnit: 5.5 },
  { name: "Stencil Paper (50pk)", unit: "pack", costPerUnit: 18.0 },
  { name: "Transfer Gel (8oz)", unit: "bottle", costPerUnit: 12.0 },
  { name: "Green Soap (32oz)", unit: "bottle", costPerUnit: 14.0 },
  { name: "Paper Towels (Roll)", unit: "roll", costPerUnit: 3.0 },
  { name: "Bandages / Wrap", unit: "each", costPerUnit: 1.5 },
  { name: "Razor (Single)", unit: "each", costPerUnit: 0.4 },
  { name: "Foam Pad / Armrest Cover", unit: "each", costPerUnit: 2.0 },
];

function buildMaterial(
  template: Omit<Material, "id" | "quantity">,
  quantity = 0
): Material {
  return { ...template, id: genId(), quantity };
}

export function getDefaultMaterials(trade: Trade): Material[] {
  switch (trade) {
    case "Plumber": return PLUMBER_MATERIALS.map((m) => buildMaterial(m));
    case "Electrician": return ELECTRICIAN_MATERIALS.map((m) => buildMaterial(m));
    case "Handyman": return HANDYMAN_MATERIALS.map((m) => buildMaterial(m));
    case "Landscaper": return LANDSCAPER_MATERIALS.map((m) => buildMaterial(m));
    case "Tattoo Artist": return TATTOO_MATERIALS.map((m) => buildMaterial(m));
    default: return [];
  }
}

export function calcTotals(
  materials: Material[],
  markupPct: number
): { subtotal: number; markupAmount: number; grandTotal: number } {
  const subtotal = materials.reduce(
    (sum, m) => sum + m.quantity * m.costPerUnit, 0
  );
  const markupAmount = subtotal * (markupPct / 100);
  return { subtotal, markupAmount, grandTotal: subtotal + markupAmount };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}