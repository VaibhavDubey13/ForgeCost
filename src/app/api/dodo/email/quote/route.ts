import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      customerEmail,
      customerName,
      jobName,
      companyName,
      trade,
      date,
      subtotal,
      markupPct,
      markupAmount,
      grandTotal,
      materials,
      notes,
    } = await req.json();

    if (!customerEmail || !jobName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const activeMaterials = materials.filter((m: { quantity: number }) => m.quantity > 0);

    const materialsRows = activeMaterials.map((m: {
      name: string; unit: string; quantity: number;
      costPerUnit: number;
    }) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1e293b;color:#e2e8f0;">${m.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1e293b;color:#94a3b8;text-align:center;">${m.quantity} ${m.unit}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1e293b;color:#94a3b8;text-align:right;">$${m.costPerUnit.toFixed(2)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1e293b;color:#e2e8f0;text-align:right;font-weight:600;">$${(m.quantity * m.costPerUnit).toFixed(2)}</td>
      </tr>
    `).join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#0d1526;border:1px solid #1e293b;border-radius:16px;padding:28px 32px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:22px;font-weight:800;color:#fff;">
          Forge<span style="color:#34d399;">Cost</span>
        </span>
        <span style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:#34d399;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;">
          QUOTE
        </span>
      </div>
      <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#fff;">${jobName}</h1>
      <p style="margin:0;color:#64748b;font-size:14px;">${trade} · ${date}</p>
      ${companyName ? `<p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">From: <strong style="color:#e2e8f0;">${companyName}</strong></p>` : ""}
      ${customerName ? `<p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Prepared for: <strong style="color:#e2e8f0;">${customerName}</strong></p>` : ""}
    </div>

    <!-- Materials table -->
    <div style="background:#0d1526;border:1px solid #1e293b;border-radius:16px;overflow:hidden;margin-bottom:24px;">
      <div style="padding:16px 20px;border-bottom:1px solid #1e293b;">
        <h2 style="margin:0;font-size:14px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Materials</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#0a0f1e;">
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Item</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Unit Price</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
          </tr>
        </thead>
        <tbody>${materialsRows}</tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="background:#0d1526;border:1px solid #1e293b;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
        <span style="color:#94a3b8;font-size:14px;">Material Subtotal</span>
        <span style="color:#e2e8f0;font-size:14px;font-weight:600;">$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
        <span style="color:#94a3b8;font-size:14px;">Markup (${markupPct}%)</span>
        <span style="color:#e2e8f0;font-size:14px;font-weight:600;">+ $${markupAmount.toFixed(2)}</span>
      </div>
      <div style="border-top:1px solid #1e293b;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#fff;font-size:16px;font-weight:700;">Total to Charge</span>
        <span style="color:#34d399;font-size:24px;font-weight:800;">$${grandTotal.toFixed(2)}</span>
      </div>
    </div>

    ${notes ? `
    <!-- Notes -->
    <div style="background:#0d1526;border:1px solid #1e293b;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <h3 style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Notes</h3>
      <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">${notes}</p>
    </div>` : ""}

    <!-- Footer -->
    <div style="text-align:center;padding:16px;">
      <p style="margin:0;color:#334155;font-size:12px;">
        Quote generated with <a href="https://forge-cost.vercel.app" style="color:#34d399;text-decoration:none;">ForgeCost</a>
        · Free material cost calculator for tradespeople
      </p>
    </div>

  </div>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: "ForgeCost Quotes <quotes@mathonymics.in>",
      to: customerEmail,
      subject: `Quote for ${jobName}${companyName ? ` from ${companyName}` : ""}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Email route error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}