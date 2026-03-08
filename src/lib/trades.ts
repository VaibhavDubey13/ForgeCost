// src/lib/trades.ts
export type Trade =
  | "Plumber"
  | "Electrician"
  | "Handyman"
  | "Landscaper"
  | "Tattoo Artist"
  | "HVAC Technician"
  | "Painter"
  | "Carpenter"
  | "Welder"
  | "Other";

export const TRADES: Trade[] = [
  "Plumber",
  "Electrician",
  "Handyman",
  "Landscaper",
  "Tattoo Artist",
  "HVAC Technician",
  "Painter",
  "Carpenter",
  "Welder",
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

const HVAC_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "Copper Line Set (3/8″)", unit: "ft", costPerUnit: 4.5 },
  { name: "Copper Line Set (1/2″)", unit: "ft", costPerUnit: 5.8 },
  { name: "Refrigerant R-410A (lb)", unit: "lb", costPerUnit: 18.0 },
  { name: "Refrigerant R-32 (lb)", unit: "lb", costPerUnit: 14.0 },
  { name: "Capacitor (45/5 MFD)", unit: "each", costPerUnit: 22.0 },
  { name: "Contactor (2-Pole)", unit: "each", costPerUnit: 18.0 },
  { name: "Thermostat (Programmable)", unit: "each", costPerUnit: 45.0 },
  { name: "Thermostat (Smart)", unit: "each", costPerUnit: 120.0 },
  { name: "Air Filter (16x20x1)", unit: "each", costPerUnit: 8.0 },
  { name: "Air Filter (20x25x4)", unit: "each", costPerUnit: 28.0 },
  { name: "Duct Tape (2″ foil)", unit: "roll", costPerUnit: 14.0 },
  { name: "Flex Duct (6″ x 25ft)", unit: "each", costPerUnit: 32.0 },
  { name: "Sheet Metal Duct (10″)", unit: "ft", costPerUnit: 6.5 },
  { name: "Drain Pan", unit: "each", costPerUnit: 28.0 },
  { name: "Condensate Drain Line", unit: "ft", costPerUnit: 1.2 },
  { name: "Disconnect Box", unit: "each", costPerUnit: 35.0 },
  { name: "Insulation Wrap (1″)", unit: "ft", costPerUnit: 1.8 },
];

const PAINTER_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "Interior Paint (1 gal)", unit: "gal", costPerUnit: 32.0 },
  { name: "Exterior Paint (1 gal)", unit: "gal", costPerUnit: 42.0 },
  { name: "Primer (1 gal)", unit: "gal", costPerUnit: 25.0 },
  { name: "Spray Paint (12oz)", unit: "can", costPerUnit: 7.0 },
  { name: "Paint Roller (9″)", unit: "each", costPerUnit: 8.0 },
  { name: "Roller Cover (9″)", unit: "each", costPerUnit: 4.5 },
  { name: "Paint Brush (2″)", unit: "each", costPerUnit: 6.0 },
  { name: "Paint Brush (4″)", unit: "each", costPerUnit: 9.0 },
  { name: "Paint Tray", unit: "each", costPerUnit: 4.0 },
  { name: "Drop Cloth (4x15)", unit: "each", costPerUnit: 12.0 },
  { name: "Painter's Tape (2″)", unit: "roll", costPerUnit: 5.5 },
  { name: "Sandpaper (Pack)", unit: "pack", costPerUnit: 7.0 },
  { name: "Caulk (Paintable)", unit: "tube", costPerUnit: 3.5 },
  { name: "Putty/Spackle (qt)", unit: "qt", costPerUnit: 9.0 },
  { name: "TSP Cleaner (lb)", unit: "lb", costPerUnit: 6.0 },
  { name: "Paint Thinner (qt)", unit: "qt", costPerUnit: 8.0 },
  { name: "Stain (1 gal)", unit: "gal", costPerUnit: 38.0 },
];

const CARPENTER_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "2×4 Stud (8ft)", unit: "each", costPerUnit: 4.5 },
  { name: "2×6 (8ft)", unit: "each", costPerUnit: 7.0 },
  { name: "2×8 (8ft)", unit: "each", costPerUnit: 9.5 },
  { name: "Plywood (4×8, 3/4″)", unit: "sheet", costPerUnit: 52.0 },
  { name: "OSB (4×8, 7/16″)", unit: "sheet", costPerUnit: 22.0 },
  { name: "MDF (4×8, 3/4″)", unit: "sheet", costPerUnit: 38.0 },
  { name: "Hardwood (Oak, bf)", unit: "bf", costPerUnit: 6.5 },
  { name: "Hardwood (Pine, bf)", unit: "bf", costPerUnit: 3.8 },
  { name: "Finish Nails (1lb)", unit: "lb", costPerUnit: 5.0 },
  { name: "Framing Nails (1lb)", unit: "lb", costPerUnit: 4.5 },
  { name: "Wood Screws (1lb)", unit: "lb", costPerUnit: 6.0 },
  { name: "Wood Glue (16oz)", unit: "bottle", costPerUnit: 8.0 },
  { name: "Construction Adhesive", unit: "tube", costPerUnit: 5.5 },
  { name: "Sandpaper Pack", unit: "pack", costPerUnit: 7.0 },
  { name: "Wood Stain (qt)", unit: "qt", costPerUnit: 14.0 },
  { name: "Polyurethane (qt)", unit: "qt", costPerUnit: 16.0 },
  { name: "Door Hinge (pair)", unit: "pair", costPerUnit: 6.5 },
  { name: "Cabinet Hardware", unit: "each", costPerUnit: 4.0 },
];

const WELDER_MATERIALS: Omit<Material, "id" | "quantity">[] = [
  { name: "Steel Flat Bar (1×1/8″)", unit: "ft", costPerUnit: 1.8 },
  { name: "Steel Angle (1×1/8″)", unit: "ft", costPerUnit: 2.2 },
  { name: "Steel Tube (1×1×1/8″)", unit: "ft", costPerUnit: 3.5 },
  { name: "Steel Plate (1/4″)", unit: "sq ft", costPerUnit: 8.0 },
  { name: "Stainless Steel Rod", unit: "ft", costPerUnit: 6.5 },
  { name: "Aluminum Sheet (1/8″)", unit: "sq ft", costPerUnit: 12.0 },
  { name: "MIG Wire (11lb spool)", unit: "spool", costPerUnit: 45.0 },
  { name: "TIG Filler Rod (lb)", unit: "lb", costPerUnit: 22.0 },
  { name: "Stick Electrode (lb)", unit: "lb", costPerUnit: 14.0 },
  { name: "Shielding Gas (cu ft)", unit: "cu ft", costPerUnit: 0.8 },
  { name: "Grinding Disc (4.5″)", unit: "each", costPerUnit: 3.5 },
  { name: "Cutting Disc (4.5″)", unit: "each", costPerUnit: 2.8 },
  { name: "Welding Wire Brush", unit: "each", costPerUnit: 5.0 },
  { name: "Anti-Spatter Spray", unit: "can", costPerUnit: 8.0 },
  { name: "Welding Gloves", unit: "pair", costPerUnit: 28.0 },
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
    case "HVAC Technician": return HVAC_MATERIALS.map((m) => buildMaterial(m));
    case "Painter": return PAINTER_MATERIALS.map((m) => buildMaterial(m));
    case "Carpenter": return CARPENTER_MATERIALS.map((m) => buildMaterial(m));
    case "Welder": return WELDER_MATERIALS.map((m) => buildMaterial(m));
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