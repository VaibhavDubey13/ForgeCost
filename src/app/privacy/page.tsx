import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ForgeCost privacy policy — how we collect, use, and protect your data.",
};

const LAST_UPDATED = "June 2025";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(222,47%,6%)", color: "hsl(210,40%,96%)" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(160,84%,39%) 1px,transparent 1px),linear-gradient(90deg,hsl(160,84%,39%) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Nav */}
      <header style={{ borderBottom: "1px solid hsl(222,35%,14%)", backgroundColor: "hsl(222,47%,5%)" }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator className="w-4 h-4" style={{ color: "#34d399" }} />
            </div>
            <span className="font-bold">Forge<span style={{ color: "#34d399" }}>Cost</span></span>
          </Link>
          <Link href="/app" className="text-sm font-medium px-4 py-2 rounded-full transition-all"
            style={{ background: "#10b981", color: "white" }}>
            Open App →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 pb-24 relative">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#34d399" }}>Legal</p>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: "hsl(215,20%,55%)" }}>Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "hsl(215,20%,75%)" }}>

          <Section title="1. Who We Are">
            ForgeCost is a material cost calculator and quote generator for tradespeople, operated as an independent
            product. When we say "ForgeCost", "we", "us", or "our" in this policy, we mean the team behind
            forge-cost.vercel.app.
          </Section>

          <Section title="2. What Data We Collect">
            <p className="mb-3">We collect only what we need to run the service:</p>
            <ul className="space-y-2 list-none pl-0">
              {[
                ["Account data", "Email address, password (hashed by Supabase — we never see it), and optionally: full name and trade/profession."],
                ["Usage data", "Quote count, saved templates, and quote history — stored so you can access them across devices."],
                ["Payment data", "Handled entirely by Dodo Payments. We receive only a customer ID and subscription status — never your card details."],
                ["Browser data", "Anonymous download count stored in localStorage for non-signed-in users. Cleared when you clear your browser data."],
              ].map(([label, desc]) => (
                <li key={label} className="pl-4" style={{ borderLeft: "2px solid hsl(222,35%,20%)" }}>
                  <span className="font-semibold text-white">{label}:</span> {desc}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="space-y-1.5">
              {[
                "To provide the app — saving templates, history, and your Pro subscription status.",
                "To send transactional emails (account confirmation, password reset). We do not send marketing emails.",
                "To send PDF quotes on your behalf when you use the Email Quote feature (Pro).",
                "To verify your subscription status with our payment processor.",
              ].map((item) => (
                <li key={item} className="flex gap-2"><span style={{ color: "#34d399" }}>✓</span>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="4. PDF Generation">
            PDFs are generated entirely in your browser using client-side JavaScript (pdfmake). Your material data,
            prices, and job details are never sent to our servers during PDF generation. They exist only on your
            device and in the downloaded file.
          </Section>

          <Section title="5. Data Storage & Security">
            Your account data is stored in Supabase, which provides enterprise-grade security with Row Level
            Security enabled — meaning your data is only accessible to your own account. Passwords are hashed
            using bcrypt. We never store plaintext passwords.
          </Section>

          <Section title="6. Third-Party Services">
            <ul className="space-y-1.5">
              {[
                ["Supabase", "Authentication and database hosting. Privacy policy at supabase.com/privacy."],
                ["Dodo Payments", "Payment processing. We receive only a subscription token, never card data."],
                ["Resend", "Transactional email delivery (quote emails, password resets). Privacy policy at resend.com/legal/privacy-policy."],
                ["Vercel", "Application hosting. Privacy policy at vercel.com/legal/privacy-policy."],
              ].map(([name, desc]) => (
                <li key={name} className="flex gap-2">
                  <span className="font-semibold text-white min-w-fit">{name}:</span> {desc}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="7. Data Retention">
            Your data is kept as long as your account is active. You can request deletion at any time by emailing us.
            On deletion we remove your profile, templates, and quote history. Payment records are retained by
            Dodo Payments per their legal obligations.
          </Section>

          <Section title="8. Your Rights">
            You have the right to access, correct, export, or delete your data. To exercise any of these rights,
            contact us at the email below. We will respond within 30 days.
          </Section>

          <Section title="9. Cookies">
            We do not use tracking cookies or advertising cookies. Supabase uses a secure HTTP-only cookie to
            maintain your login session. That is the only cookie we use.
          </Section>

          <Section title="10. Children">
            ForgeCost is intended for working tradespeople and is not directed at children under 13. We do not
            knowingly collect data from children.
          </Section>

          <Section title="11. Changes to This Policy">
            We may update this policy as the product evolves. Significant changes will be communicated via the
            app or email. Continued use after changes constitutes acceptance.
          </Section>

          <Section title="12. Contact">
            Questions about this policy? Email us at{" "}
            <a href="mailto:privacy@mathonymics.in" style={{ color: "#34d399" }}>
              privacy@mathonymics.in
            </a>
          </Section>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid hsl(222,35%,14%)" }} className="py-6 text-center">
        <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "hsl(215,20%,55%)" }}>
          <Link href="/privacy" style={{ color: "#34d399" }}>Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/app" className="hover:text-white transition-colors">Open App</Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  );
}