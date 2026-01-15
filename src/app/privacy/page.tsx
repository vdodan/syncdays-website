import Link from "next/link";
import { Header, Footer, Container, Section } from "@/components";

export const metadata = {
  title: "Privacy Policy - SyncDays",
  description: "How SyncDays collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <Section className="pt-32 sm:pt-40" animate={false}>
        <Container size="md">
          <h1 className="text-4xl font-bold text-jet-black mb-2">Privacy Policy</h1>
          <p className="text-pale-oak mb-8">Last updated: January 7, 2026</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-jet-black leading-relaxed mb-6">
              This Privacy Policy describes how <strong>KOOB HUB S.R.L.</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your personal data when you use the SyncDays application (&quot;the App&quot;).
            </p>

            <div className="bg-soft-linen/50 border border-pale-oak/20 rounded-xl p-6 mb-8">
              <p className="font-semibold text-jet-black mb-2">Data Controller:</p>
              <p className="text-pale-oak">
                KOOB HUB S.R.L.<br />
                VAT ID: RO35639407<br />
                EUID: ROONRC.J201600202840<br />
                Address: Maria Rosetti Street nr.27, Ap. 6, Sector 2, Bucharest, Romania<br />
                Contact: <a href="mailto:hello@syncdays.com" className="text-sandy-brown hover:underline">hello@syncdays.com</a>
              </p>
            </div>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">1. Data We Collect</h2>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">1.1 Account Information</h3>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Email address</strong> - Used for authentication, account recovery, and important notifications</li>
              <li><strong>Password</strong> - Stored securely using industry-standard hashing (never stored in plain text)</li>
              <li><strong>Display name</strong> - Optional, used to personalize your experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">1.2 User-Created Content</h3>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Calendar events</strong> - Event names, dates, categories, notes, and styling preferences</li>
              <li><strong>Habits</strong> - Habit titles, frequency settings, and completion records</li>
              <li><strong>Backlog items</strong> - Books, games, movies, and TV shows you&apos;re tracking, including progress</li>
              <li><strong>Exercise logs</strong> - Workout data, exercises, sets, reps, and weights</li>
              <li><strong>Categories and baskets</strong> - Your organizational preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">1.3 Connected Services Data</h3>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Google Calendar</strong> - If you connect your Google account, we access your calendar events in read-only mode to display them alongside your SyncDays events. We do not modify your Google Calendar.</li>
            </ul>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">1.4 Usage and Technical Data</h3>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Analytics events</strong> - Screen views, feature usage, and app interactions (anonymized)</li>
              <li><strong>Device information</strong> - Browser type, operating system, screen size</li>
              <li><strong>Error logs</strong> - Technical errors to help us improve the app</li>
            </ul>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">1.5 Payment Information</h3>
            <p className="text-jet-black mb-4">
              Payment processing is handled by Stripe. We do not store your credit card details. Stripe may collect payment information in accordance with their <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sandy-brown hover:underline">Privacy Policy</a>.
            </p>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Provide the service</strong> - Store and sync your calendar, habits, and other content across devices</li>
              <li><strong>Authentication</strong> - Verify your identity and secure your account</li>
              <li><strong>Improve the app</strong> - Analyze usage patterns to fix bugs and develop new features</li>
              <li><strong>Communication</strong> - Send account-related emails (password reset, security alerts)</li>
              <li><strong>Customer support</strong> - Respond to your inquiries and help resolve issues</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">3. Legal Basis for Processing (GDPR)</h2>
            <p className="text-jet-black mb-2">We process your personal data based on:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Contract performance</strong> - To provide the SyncDays service you signed up for</li>
              <li><strong>Legitimate interests</strong> - To improve our service, ensure security, and prevent fraud</li>
              <li><strong>Consent</strong> - For optional features like Google Calendar integration</li>
              <li><strong>Legal obligations</strong> - To comply with applicable laws</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">4. Third-Party Services</h2>
            <p className="text-jet-black mb-4">We use the following third-party services to operate SyncDays:</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-soft-linen/50">
                    <th className="border border-pale-oak/20 p-3 text-left text-jet-black">Service</th>
                    <th className="border border-pale-oak/20 p-3 text-left text-jet-black">Purpose</th>
                    <th className="border border-pale-oak/20 p-3 text-left text-jet-black">Data Shared</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-pale-oak/20 p-3 text-jet-black">Supabase</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Database, Authentication</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">All user data</td>
                  </tr>
                  <tr>
                    <td className="border border-pale-oak/20 p-3 text-jet-black">Google OAuth</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Calendar sync (optional)</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Calendar events (read-only)</td>
                  </tr>
                  <tr>
                    <td className="border border-pale-oak/20 p-3 text-jet-black">Stripe</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Payment processing</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Email, payment details</td>
                  </tr>
                  <tr>
                    <td className="border border-pale-oak/20 p-3 text-jet-black">Sentry</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Error tracking</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">Error logs, device info</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">5. Data Retention</h2>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Active accounts</strong> - Your data is retained as long as your account is active</li>
              <li><strong>Deleted accounts</strong> - When you delete your account, all personal data is permanently deleted within 30 days</li>
              <li><strong>Backups</strong> - Encrypted backups may retain data for up to 90 days for disaster recovery</li>
              <li><strong>Analytics</strong> - Anonymized usage data may be retained indefinitely for statistical purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">6. Your Rights (GDPR)</h2>
            <p className="text-jet-black mb-2">As an EU resident, you have the following rights:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li><strong>Right to access</strong> - Request a copy of your personal data</li>
              <li><strong>Right to rectification</strong> - Correct inaccurate data</li>
              <li><strong>Right to erasure</strong> - Delete your account and all associated data</li>
              <li><strong>Right to data portability</strong> - Export your data in a machine-readable format</li>
              <li><strong>Right to restrict processing</strong> - Limit how we use your data</li>
              <li><strong>Right to object</strong> - Object to processing based on legitimate interests</li>
              <li><strong>Right to withdraw consent</strong> - Disconnect Google Calendar or revoke other consents at any time</li>
            </ul>
            <p className="text-jet-black mb-4">
              To exercise these rights, use the options in the app&apos;s Settings screen or contact us at <a href="mailto:hello@syncdays.com" className="text-sandy-brown hover:underline">hello@syncdays.com</a>.
            </p>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">7. Data Security</h2>
            <p className="text-jet-black mb-2">We implement appropriate technical and organizational measures to protect your data:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>All data transmitted using TLS/HTTPS encryption</li>
              <li>Passwords hashed using industry-standard algorithms</li>
              <li>Database access restricted with Row Level Security (RLS)</li>
              <li>Regular security audits and updates</li>
              <li>Access to personal data limited to authorized personnel only</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">8. Contact Us</h2>
            <p className="text-jet-black mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="bg-soft-linen/50 border border-pale-oak/20 rounded-xl p-6 mb-8">
              <p className="text-pale-oak">
                <strong className="text-jet-black">KOOB HUB S.R.L.</strong><br />
                Email: <a href="mailto:hello@syncdays.com" className="text-sandy-brown hover:underline">hello@syncdays.com</a><br />
                Address: Maria Rosetti Street nr.27, Ap. 6, Sector 2, Bucharest, Romania
              </p>
            </div>

            <div className="text-center pt-8 border-t border-pale-oak/20">
              <Link href="/" className="text-sandy-brown hover:underline mr-4">Back to SyncDays</Link>
              <Link href="/terms" className="text-sandy-brown hover:underline">Terms of Service</Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
