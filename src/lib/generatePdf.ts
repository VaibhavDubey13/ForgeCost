// src/lib/generatePdf.ts
import type { Material } from "./trades";
import { calcTotals, formatCurrency } from "./trades";

export interface QuoteData {
  jobName: string;
  trade: string;
  date: string;
  materials: Material[];
  markupPct: number;
  companyName?: string;
  notes?: string;
  isPro?: boolean; 
  logoUrl?: string;
}

export async function downloadPdfQuote(data: QuoteData): Promise<void> {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfMake = (pdfMakeModule as any).default ?? pdfMakeModule;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfFonts = (pdfFontsModule as any).default ?? pdfFontsModule;
  pdfMake.vfs = pdfFonts.vfs ?? pdfFonts.pdfMake?.vfs;

  const activeMaterials = data.materials.filter((m) => m.quantity > 0);
  const isFree = !data.isPro;
  const { subtotal, markupAmount, grandTotal } = calcTotals(activeMaterials, data.markupPct);

  const DARK = "#0f172a";
  const EMERALD = "#10b981";
  const WHITE = "#ffffff";
  const GRAY = "#94a3b8";
  const ROW_ALT = "#f1f5f9";

  const tableBody: unknown[][] = [
    [
      { text: "Material", bold: true, fontSize: 9, color: WHITE, fillColor: DARK, margin: [6, 8, 6, 8] },
      { text: "Unit", bold: true, fontSize: 9, color: WHITE, fillColor: DARK, alignment: "center", margin: [6, 8, 6, 8] },
      { text: "Unit Cost", bold: true, fontSize: 9, color: WHITE, fillColor: DARK, alignment: "right", margin: [6, 8, 6, 8] },
      { text: "Qty", bold: true, fontSize: 9, color: WHITE, fillColor: DARK, alignment: "center", margin: [6, 8, 6, 8] },
      { text: "Line Total", bold: true, fontSize: 9, color: WHITE, fillColor: DARK, alignment: "right", margin: [6, 8, 6, 8] },
    ],
    ...activeMaterials.map((m, i) => {
      const fill = i % 2 === 0 ? WHITE : ROW_ALT;
      return [
        { text: m.name, fontSize: 10, fillColor: fill, margin: [6, 6, 6, 6] },
        { text: m.unit, fontSize: 10, alignment: "center", fillColor: fill, margin: [6, 6, 6, 6] },
        { text: formatCurrency(m.costPerUnit), fontSize: 10, alignment: "right", fillColor: fill, margin: [6, 6, 6, 6] },
        { text: m.quantity.toString(), fontSize: 10, alignment: "center", fillColor: fill, margin: [6, 6, 6, 6] },
        { text: formatCurrency(m.quantity * m.costPerUnit), fontSize: 10, bold: true, alignment: "right", fillColor: fill, margin: [6, 6, 6, 6] },
      ];
    }),
  ];

  const docDefinition = {
    pageSize: "LETTER" as const,
    pageMargins: [48, 48, 48, 48] as [number, number, number, number],
    defaultStyle: { font: "Roboto", fontSize: 10, color: "#1e293b" },
    content: [
      // Header
      { canvas: [{ type: "rect", x: -48, y: -48, w: 800, h: 90, color: DARK }], absolutePosition: { x: 0, y: 0 } },
      {
        columns: [
          {
            stack: [
              { text: "ForgeCost", fontSize: 26, bold: true, color: EMERALD },
              { text: `${data.trade.toUpperCase()} MATERIAL QUOTE`, fontSize: 11, color: GRAY },
            ],
          },
          {
            stack: [
              { text: data.companyName?.toUpperCase() ?? "", fontSize: 11, bold: true, color: WHITE, alignment: "right" },
              { text: data.date, fontSize: 9, color: GRAY, alignment: "right", margin: [0, 4, 0, 0] },
            ],
          },
        ],
        margin: [0, 0, 0, 32],
      },
      // Job details
      {
        columns: [
          { stack: [{ text: "JOB NAME", fontSize: 8, bold: true, color: GRAY, characterSpacing: 1.5, margin: [0, 0, 0, 2] }, { text: data.jobName || "—", fontSize: 13, bold: true }], width: "*" },
          { stack: [{ text: "DATE", fontSize: 8, bold: true, color: GRAY, characterSpacing: 1.5, margin: [0, 0, 0, 2] }, { text: data.date, fontSize: 13, bold: true }], width: "auto" },
        ],
        margin: [0, 0, 0, 20],
      },
      // Divider
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 516, y2: 0, lineWidth: 2, lineColor: EMERALD }], margin: [0, 0, 0, 16] },
      // Table
      activeMaterials.length > 0 ? {
        table: { headerRows: 1, widths: ["*", 60, 75, 40, 80], body: tableBody },
        layout: { hLineWidth: (i: number) => i <= 1 ? 0 : 0.5, vLineWidth: () => 0, hLineColor: () => "#1e293b", paddingLeft: () => 0, paddingRight: () => 0 },
        margin: [0, 0, 0, 20],
      } : { text: "No materials selected.", fontSize: 9, italics: true, margin: [0, 0, 0, 20] },
      // Totals
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 240,
            stack: [
              { columns: [{ text: "Subtotal", width: "*" }, { text: formatCurrency(subtotal), width: "auto", bold: true, alignment: "right" }], margin: [0, 0, 0, 6] },
              { columns: [{ text: `Markup (${data.markupPct}%)`, width: "*" }, { text: `+ ${formatCurrency(markupAmount)}`, width: "auto", bold: true, color: EMERALD, alignment: "right" }], margin: [0, 0, 0, 10] },
              { canvas: [{ type: "line", x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1, lineColor: "#1e293b" }], margin: [0, 0, 0, 10] },
              {
                fillColor: DARK,
                table: {
                  widths: ["*", "auto"],
                  body: [[
                    { text: "TOTAL TO CHARGE", fontSize: 14, bold: true, color: WHITE, margin: [12, 10, 0, 10] },
                    { text: formatCurrency(grandTotal), fontSize: 14, bold: true, color: EMERALD, alignment: "right", margin: [0, 10, 12, 10] },
                  ]],
                },
                layout: { hLineWidth: () => 0, vLineWidth: () => 0 },
              },
            ],
          },
        ],
        margin: [0, 0, 0, 24],
      },
      // Notes
      ...(data.notes ? [
        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 516, y2: 0, lineWidth: 0.5, lineColor: "#1e293b" }], margin: [0, 0, 0, 10] },
        { text: "NOTES", fontSize: 8, bold: true, color: GRAY, characterSpacing: 1.5, margin: [0, 0, 0, 4] },
        { text: data.notes, fontSize: 9, italics: true, color: "#475569" },
      ] : []),
      // ── Free tier watermark ───────────────────────────────────────────────
      ...(isFree ? [{
        text: "Generated with ForgeCost Free — upgrade to Pro to remove watermark",
        fontSize: 7,
        color: "#94a3b8",
        alignment: "center" as const,
        margin: [0, 16, 0, 4] as [number, number, number, number],
      }] : []),
      // Footer
      { text: `Generated by ForgeCost • ${data.date} • Quote valid for 30 days`, fontSize: 8, color: GRAY, alignment: "center", margin: [0, 32, 0, 8] },
      { canvas: [{ type: "rect", x: 0, y: 0, w: 516, h: 3, color: EMERALD, r: 2 }] },
    ],
  };

  const safeJob = (data.jobName || "quote").replace(/[^a-zA-Z0-9\s_-]/g, "").replace(/\s+/g, "_").toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfMake as any).createPdf(docDefinition).download(`ForgeCost_${safeJob}_${data.date.replace(/\//g, "-")}.pdf`);
}