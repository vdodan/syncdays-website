"use client";

import { Calendar, Users, ListTodo, CheckCircle, Dumbbell, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Header, Footer, Container, Section, Button, Card, Badge } from "@/components";

const features = [
  {
    id: "calendar",
    icon: <Calendar className="h-12 w-12" />,
    title: "The Infinite Grid",
    tagline: "Plan in days, not hours",
    description: "Most calendars are designed for meetings and appointments. SyncDays is designed for life planning. See your whole year at a glance, drag events like sticky notes, and never worry about overbooking your day again.",
    highlights: [
      "See months and years at once",
      "Drag and drop to reschedule",
      "Day as the smallest unit",
      "Color-coded categories",
    ],
    isPro: false,
  },
  {
    id: "collaboration",
    icon: <Users className="h-12 w-12" />,
    title: "Plan Together",
    tagline: "Share calendars, not chaos",
    description: "Create shared calendars for your family, friend groups, or coworkers. Everyone sees what's planned without seeing each other's private events. No more WhatsApp threads to coordinate.",
    highlights: [
      "Create unlimited shared calendars",
      "Invite anyone via email",
      "Private and shared events",
      "Real-time sync everywhere",
    ],
    isPro: false,
  },
  {
    id: "backlog",
    icon: <ListTodo className="h-12 w-12" />,
    title: "Track Your Backlog",
    tagline: "Your 'I'll get to it' list",
    description: "Books, games, movies, TV shows — we all have that pile of shame. SyncDays helps you track what you want to consume, with automatic time estimates so you can actually plan when you'll get to it.",
    highlights: [
      "Books, games, movies, TV shows",
      "Auto time estimates from TMDB, RAWG, OpenLibrary",
      "Assign to calendar months",
      "Track completion progress",
    ],
    isPro: false,
  },
  {
    id: "habits",
    icon: <CheckCircle className="h-12 w-12" />,
    title: "Habit Tracking",
    tagline: "Streaks that stick",
    description: "Daily, weekly, or custom frequency habits. Check them off, watch your streaks grow, and feel unreasonably proud of yourself. Simple and effective.",
    highlights: [
      "Daily/weekly/custom frequencies",
      "Visual streak tracking",
      "365-day history view",
      "Toggle on or off anytime",
    ],
    isPro: true,
  },
  {
    id: "exercise",
    icon: <Dumbbell className="h-12 w-12" />,
    title: "Exercise Logging",
    tagline: "Workouts without gym bro vibes",
    description: "Log your sets and reps, track your personal records, and use the built-in rest timer. No complicated programs or subscriptions — just simple workout tracking.",
    highlights: [
      "Log sets and reps",
      "Track personal records",
      "Built-in rest timer",
      "Exercise library",
    ],
    isPro: true,
  },
  {
    id: "relationships",
    icon: <Heart className="h-12 w-12" />,
    title: "Relationship Management",
    tagline: "Never forget to reach out",
    description: "Track when you last contacted your friends and family. Set reminders so you never go too long without checking in on the people who matter.",
    highlights: [
      "Track last contact date",
      "Set contact frequency goals",
      "Overdue contact alerts",
      "Notes and context",
    ],
    isPro: false,
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <Section className="pt-32 sm:pt-40 pb-8" animate={false}>
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-jet-black mb-6">
              Everything you need to{" "}
              <span className="text-sandy-brown">plan your life</span>
            </h1>
            <p className="text-lg text-pale-oak mb-8">
              Not another to-do app. SyncDays thinks in days, not hours. Here&apos;s what makes it different.
            </p>
            <Button href="https://app.syncdays.com" size="lg" external>
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* Features Deep Dive */}
      {features.map((feature, index) => (
        <Section
          key={feature.id}
          id={feature.id}
          className={index % 2 === 0 ? "" : "bg-soft-linen/50"}
        >
          <Container>
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-sandy-brown">{feature.icon}</div>
                  {feature.isPro && <Badge variant="pro">Pro</Badge>}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-jet-black mb-2">
                  {feature.title}
                </h2>
                <p className="text-xl text-sandy-brown mb-4">{feature.tagline}</p>
                <p className="text-pale-oak text-lg mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sandy-brown" />
                      <span className="text-jet-black">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <Card hover={false} className="aspect-[4/3] flex items-center justify-center">
                  <div className="text-center text-pale-oak">
                    <div className="mb-4 opacity-30">{feature.icon}</div>
                    <p className="text-sm">{feature.title} Screenshot</p>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* Pro Features Summary */}
      <Section className="bg-jet-black text-soft-linen">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandy-brown/20 text-sandy-brown text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Pro Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              All features included in Pro
            </h2>
            <p className="text-pale-oak text-lg mb-8">
              Habits, exercise logging, Google Calendar sync, and unlimited everything. Just $4.99/month or $49.99/year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="https://app.syncdays.com" size="lg" external>
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                View Pricing
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
