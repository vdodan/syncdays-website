import Link from "next/link";
import { Header, Footer, Container, Section } from "@/components";

export const metadata = {
  title: "Terms of Service - SyncDays",
  description: "Terms and conditions for using the SyncDays application.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <Section className="pt-32 sm:pt-40" animate={false}>
        <Container size="md">
          <h1 className="text-4xl font-bold text-jet-black mb-2">Terms of Service</h1>
          <p className="text-pale-oak mb-8">Last updated: January 7, 2026</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-jet-black leading-relaxed mb-6">
              Welcome to SyncDays. These Terms of Service (&quot;Terms&quot;) govern your use of the SyncDays application and website (collectively, the &quot;Service&quot;) operated by <strong>KOOB HUB S.R.L.</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>

            <div className="bg-sandy-brown/10 border border-sandy-brown/30 rounded-xl p-6 mb-8">
              <p className="text-jet-black">
                <strong>Important:</strong> By creating an account or using SyncDays, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
              </p>
            </div>

            <div className="bg-soft-linen/50 border border-pale-oak/20 rounded-xl p-6 mb-8">
              <p className="font-semibold text-jet-black mb-2">Service Provider:</p>
              <p className="text-pale-oak">
                KOOB HUB S.R.L.<br />
                VAT ID: RO35639407<br />
                EUID: ROONRC.J201600202840<br />
                Address: Maria Rosetti Street nr.27, Ap. 6, Sector 2, Bucharest, Romania<br />
                Contact: <a href="mailto:hello@syncdays.com" className="text-sandy-brown hover:underline">hello@syncdays.com</a>
              </p>
            </div>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">1. Description of Service</h2>
            <p className="text-jet-black mb-2">SyncDays is a personal planning and tracking application that allows you to:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>Create and manage calendar events for long-term planning</li>
              <li>Track daily habits and build streaks</li>
              <li>Maintain a backlog of books, games, movies, and TV shows</li>
              <li>Log workouts and track fitness progress</li>
              <li>Optionally sync with Google Calendar</li>
              <li>Share calendars with family members</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">2. Account Registration</h2>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">2.1 Eligibility</h3>
            <p className="text-jet-black mb-4">
              You must be at least 16 years old to create an account and use SyncDays. By registering, you represent that you meet this age requirement.
            </p>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">2.2 Account Security</h3>
            <p className="text-jet-black mb-2">You are responsible for:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>Providing accurate and complete registration information</li>
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">3. Subscription Plans and Pricing</h2>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">3.1 Free Tier</h3>
            <p className="text-jet-black mb-2">SyncDays offers a free tier with the following limitations:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>Up to 10 custom categories</li>
              <li>1 family with up to 2 members</li>
              <li>Basic backlog features</li>
            </ul>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">3.2 Pro Subscription</h3>
            <p className="text-jet-black mb-2">SyncDays Pro unlocks all features, including:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>Unlimited categories</li>
              <li>Unlimited families and members</li>
              <li>Habits tracking</li>
              <li>Exercise logging</li>
              <li>Google Calendar integration (experimental)</li>
            </ul>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">3.3 Pricing</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-soft-linen/50">
                    <th className="border border-pale-oak/20 p-3 text-left text-jet-black">Plan</th>
                    <th className="border border-pale-oak/20 p-3 text-left text-jet-black">Price (USD)</th>
                    <th className="border border-pale-oak/20 p-3 text-left text-jet-black">Price (EUR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-pale-oak/20 p-3 text-jet-black">Monthly</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">$4.99/month</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">€4.99/month</td>
                  </tr>
                  <tr>
                    <td className="border border-pale-oak/20 p-3 text-jet-black">Yearly</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">$49.99/year</td>
                    <td className="border border-pale-oak/20 p-3 text-pale-oak">€49.99/year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">3.4 Refunds</h3>
            <p className="text-jet-black mb-4">
              We offer a 14-day money-back guarantee for new Pro subscriptions. If you are not satisfied, contact us within 14 days of your initial purchase for a full refund. Refunds are not available for renewal payments.
            </p>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">4. Acceptable Use</h2>
            <p className="text-jet-black mb-2">You agree not to use SyncDays to:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Share your account credentials with others</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">5. Your Content</h2>
            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">5.1 Ownership</h3>
            <p className="text-jet-black mb-4">
              You retain full ownership of all content you create in SyncDays, including events, habits, backlog items, and notes. We do not claim any intellectual property rights over your content.
            </p>

            <h3 className="text-xl font-semibold text-jet-black mt-6 mb-3">5.2 License to Us</h3>
            <p className="text-jet-black mb-4">
              By using the Service, you grant us a limited license to store, process, and display your content solely for the purpose of providing the Service to you. This license ends when you delete your content or account.
            </p>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">6. Disclaimers</h2>
            <div className="bg-sandy-brown/10 border border-sandy-brown/30 rounded-xl p-6 mb-4">
              <p className="text-jet-black font-semibold">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">7. Limitation of Liability</h2>
            <p className="text-jet-black mb-2">To the maximum extent permitted by law:</p>
            <ul className="list-disc list-inside text-jet-black space-y-2 mb-4">
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
              <li>We are not liable for any loss of data, profits, or business opportunities</li>
            </ul>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">8. Changes to Terms</h2>
            <p className="text-jet-black mb-4">
              We may modify these Terms at any time. We will notify you of material changes by posting a notice in the app, sending an email to your registered address, and updating the &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">9. Governing Law</h2>
            <p className="text-jet-black mb-4">
              These Terms are governed by the laws of Romania. Any disputes shall be submitted to the competent courts of Bucharest, Romania. If you are an EU consumer, you may also use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-sandy-brown hover:underline">ec.europa.eu/consumers/odr</a>.
            </p>

            <h2 className="text-2xl font-bold text-jet-black mt-10 mb-4 pb-2 border-b border-pale-oak/20">10. Contact Us</h2>
            <p className="text-jet-black mb-4">If you have questions about these Terms, please contact us:</p>
            <div className="bg-soft-linen/50 border border-pale-oak/20 rounded-xl p-6 mb-8">
              <p className="text-pale-oak">
                <strong className="text-jet-black">KOOB HUB S.R.L.</strong><br />
                Email: <a href="mailto:hello@syncdays.com" className="text-sandy-brown hover:underline">hello@syncdays.com</a><br />
                Address: Maria Rosetti Street nr.27, Ap. 6, Sector 2, Bucharest, Romania
              </p>
            </div>

            <div className="text-center pt-8 border-t border-pale-oak/20">
              <Link href="/" className="text-sandy-brown hover:underline mr-4">Back to SyncDays</Link>
              <Link href="/privacy" className="text-sandy-brown hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
