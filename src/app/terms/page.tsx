import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ForgeCost terms of service — the rules for using the platform.",
};

const LAST_UPDATED = "June 2025";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm mb-10" style={{ color: "hsl(215,20%,55%)" }}>Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "hsl(215,20%,75%)" }}>

          <Section title="1. Acceptance of Terms">
            By accessing or using ForgeCost ("the Service"), you agree to be bound by these Terms of Service.
            If you do not agree, please do not use the Service. We may update these terms from time to time —
            continued use after changes means you accept the updated terms.
          </Section>

          <Section title="2. Description of Service">
            ForgeCost is a material cost calculator that helps tradespeople estimate job costs, apply markup,
            and generate PDF quotes. The Service is provided "as is" for professional use. It is not a licensed
            accounting or legal tool and should not be used as the sole basis for formal contracts or invoices.
          </Section>

          <Section title="3. Accounts">
            <ul className="space-y-2">
              {[
                "You must provide accurate information when creating an account.",
                "You are responsible for keeping your password secure. We are not liable for losses from unauthorised access.",
                "You must be at least 13 years old to use the Service.",
                "One person, one account. Do not share your account credentials.",
              ].map((t) => (
                <li key={t} className="flex gap-2"><span style={{ color: "#34d399" }}>—</span>{t}</li>
              ))}
            </ul>
          </Section>

          <Section title="4. Free Plan and Pro Subscription">
            <p className="mb-3">ForgeCost offers a free plan with limited features and a paid Pro plan.</p>
            <ul className="space-y-2">
              {[
                "Free plan limits (quotes, templates) are subject to change with reasonable notice.",
                "Pro subscriptions are billed monthly or annually. Prices are shown at the time of purchase.",
                "Subscriptions auto-renew. You may cancel at any time; cancellation takes effect at the end of the current billing period.",
                "We do not offer refunds for partial billing periods, except where required by law.",
                "We reserve the right to change Pro pricing with at least 30 days notice to existing subscribers.",
              ].map((t) => (
                <li key={t} className="flex gap-2"><span style={{ color: "#34d399" }}>—</span>{t}</li>
              ))}
            </ul>
          </Section>

          <Section title="5. Acceptable Use">
            You agree not to:
            <ul className="space-y-2 mt-3">
              {[
                "Use the Service for any unlawful purpose.",
                "Attempt to reverse-engineer, scrape, or attack the Service.",
                "Impersonate another person or business in quotes or communications.",
                "Use the Email Quote feature to send spam or unsolicited commercial email.",
              ].map((t) => (
                <li key={t} className="flex gap-2"><span style={{ color: "#f87171" }}>✗</span>{t}</li>
              ))}
            </ul>
          </Section>

          <Section title="6. Your Content">
            You own the material data, job names, and quotes you create. By using the Service you grant us a
            limited licence to store and process your content solely to provide the Service to you. We do not
            sell or share your content with third parties.
          </Section>

          <Section title="7. PDF Generation & Accuracy">
            PDFs are generated client-side in your browser. ForgeCost is a calculation aid — you are responsible
            for verifying the accuracy of all figures before sharing quotes with customers. We are not liable
            for losses arising from quoting errors.
          </Section>

          <Section title="8. Intellectual Property">
            The ForgeCost name, logo, and application code are our intellectual property. You may not copy or
            redistribute them. The PDF quotes you generate belong to you.
          </Section>

          <Section title="9. Disclaimer of Warranties">
            The Service is provided "as is" without warranty of any kind. We do not guarantee that the Service
            will be uninterrupted, error-free, or suitable for any particular purpose.
          </Section>

          <Section title="10. Limitation of Liability">
            To the fullest extent permitted by law, ForgeCost and its operators shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of the Service. Our total
            liability shall not exceed the amount you paid us in the 3 months prior to the claim.
          </Section>

          <Section title="11. Termination">
            We may suspend or terminate your account if you breach these terms. You may delete your account
            at any time by contacting us. On termination, your data will be deleted within 30 days.
          </Section>

          <Section title="12. Governing Law">
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of the courts of Prayagraj, Uttar Pradesh.
          </Section>

          <Section title="13. Contact">
            Questions about these terms? Email{" "}
            <a href="mailto:legal@mathonymics.in" style={{ color: "#34d399" }}>
              legal@mathonymics.in
            </a>
          </Section>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid hsl(222,35%,14%)" }} className="py-6 text-center">
        <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "hsl(215,20%,55%)" }}>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" style={{ color: "#34d399" }}>Terms of Service</Link>
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