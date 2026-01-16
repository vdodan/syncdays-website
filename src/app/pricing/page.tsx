"use client";

import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { Header, Footer, Container, Section, Button, Card } from "@/components";

const features = [
  { name: "Calendar (infinite grid)", free: true, pro: true },
  { name: "Backlog (books, games, movies, TV)", free: true, pro: true },
  { name: "Relationship Management", free: true, pro: true },
  { name: "Categories", free: "10", pro: "Unlimited" },
  { name: "Family sharing", free: "1 family, 2 members", pro: "Unlimited" },
  { name: "Habits tracking", free: false, pro: true },
  { name: "Exercise logging", free: false, pro: true },
  { name: "Google Calendar sync", free: false, pro: "Experimental" },
];

const faqs = [
  {
    question: "Can I try Pro features before buying?",
    answer: "Yes! Sign up for free and you'll have access to all features during your first 14 days. No credit card required.",
  },
  {
    question: "What happens to my data if I cancel Pro?",
    answer: "Your data is always yours. If you cancel Pro, you keep full access to your calendar and backlog. Only Pro features (habits, exercise) become read-only.",
  },
  {
    question: "Can I share with more than 2 family members on Free?",
    answer: "The free tier includes 1 family with up to 2 members. Upgrade to Pro for unlimited families and members.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Yes! Annual billing is $49.99/year (2 months free compared to monthly).",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const monthlyPrice = 4.99;
  const yearlyPrice = 49.99;
  const currentPrice = billingPeriod === "monthly" ? monthlyPrice : yearlyPrice;
  const periodLabel = billingPeriod === "monthly" ? "/month" : "/year";

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <Section className="pt-32 sm:pt-40 pb-8" animate={false}>
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">Pricing</p>
            <h1 className="text-5xl sm:text-6xl font-medium text-black leading-tight mb-6">
              Simple,{" "}
              <span className="accent-text">transparent</span>{" "}
              pricing
            </h1>
            <p className="text-lg text-muted mb-8">
              Start free, upgrade when you need more. Everyone gets the same support.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1 p-1 bg-warm-beige rounded-full">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-black text-white"
                    : "text-muted hover:text-black"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === "yearly"
                    ? "bg-black text-white"
                    : "text-muted hover:text-black"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs text-accent">Save 17%</span>
              </button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Pricing Cards */}
      <Section className="pt-8">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {/* Free Tier */}
            <Card hover={false} variant="beige">
              <div className="mb-6">
                <h3 className="text-2xl font-medium text-black mb-2">Free</h3>
                <p className="text-muted">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-medium text-black">$0</span>
                <span className="text-muted">/forever</span>
              </div>
              <Button href="https://app.syncdays.com" variant="outline" className="w-full mb-8" external>
                Get Started
              </Button>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.free === true ? (
                      <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    ) : feature.free === false ? (
                      <X className="h-5 w-5 text-tan flex-shrink-0 mt-0.5" />
                    ) : (
                      <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.free === false ? "text-muted" : "text-black"}>
                      {feature.name}
                      {typeof feature.free === "string" && (
                        <span className="text-muted ml-1">({feature.free})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Pro Tier */}
            <Card hover={false} className="relative border-2 border-black">
              <div className="absolute -top-3 left-6">
                <span className="bg-black text-white text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-medium text-black mb-2">Pro</h3>
                <p className="text-muted">For power users and families</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-medium text-black">${currentPrice}</span>
                <span className="text-muted">{periodLabel}</span>
              </div>
              <Button href="https://app.syncdays.com" className="w-full mb-8" external>
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-black">
                      {feature.name}
                      {typeof feature.pro === "string" && feature.pro !== "Unlimited" && (
                        <span className="text-muted ml-1">({feature.pro})</span>
                      )}
                      {feature.pro === "Unlimited" && (
                        <span className="text-accent ml-1">(Unlimited)</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-warm-beige">
        <Container>
          <div className="max-w-2xl mb-16">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-medium text-black leading-tight">
              Frequently asked{" "}
              <span className="accent-text">questions</span>
            </h2>
          </div>

          <div className="max-w-3xl space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} hover={false}>
                <h3 className="text-lg font-medium text-black mb-3">{faq.question}</h3>
                <p className="text-muted leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-black text-white">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm text-white/50 mb-4 uppercase tracking-wide">Get started</p>
            <h2 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
              Start planning{" "}
              <span className="accent-text">today</span>
            </h2>
            <p className="text-white/60 text-lg mb-8">
              No credit card required. Upgrade anytime.
            </p>
            <Button href="https://app.syncdays.com" variant="secondary" size="lg" external>
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
