"use client";

import { Calendar, Users, ListTodo, Dumbbell, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Header, Footer, Container, Section, Button, FeatureCard, Card } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <Section className="pt-32 sm:pt-40 pb-16" animate={false}>
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-jet-black leading-tight mb-6">
              Plan your life{" "}
              <span className="text-sandy-brown">together</span>
            </h1>
            <p className="text-lg sm:text-xl text-pale-oak mb-8 max-w-2xl mx-auto leading-relaxed">
              The shared calendar for families, friends, and anyone who doesn&apos;t want to merge
              Google Calendars. See your whole year at a glance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="https://app.syncdays.com" size="lg" external>
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button href="#features" variant="outline" size="lg">
                See How It Works
              </Button>
            </div>
          </div>

          {/* Screenshot Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-white/40 backdrop-blur rounded-2xl border border-pale-oak/20 shadow-2xl p-4 sm:p-8 max-w-5xl mx-auto">
              <div className="aspect-[16/9] bg-gradient-to-br from-pale-oak/10 to-pale-oak/5 rounded-xl flex items-center justify-center">
                <div className="text-center text-pale-oak">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-sm">App Screenshot Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Collaboration Section - Hero Feature */}
      <Section id="collaboration" className="bg-jet-black text-soft-linen">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Share what matters.{" "}
                <span className="text-sandy-brown">Keep what&apos;s private.</span>
              </h2>
              <p className="text-pale-oak text-lg mb-6 leading-relaxed">
                No more &quot;wait, I thought YOU were picking up the kids.&quot; Create shared calendars
                for your family, friend groups, or coworkers. Everyone sees the plan without
                seeing each other&apos;s work calendar.
              </p>
              <ul className="space-y-4">
                {[
                  "Create unlimited shared calendars",
                  "Invite family, friends, or coworkers",
                  "Each person keeps their private events",
                  "Real-time sync across all devices",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-sandy-brown flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-charcoal-blue/50 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center text-pale-oak">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-40" />
                <p className="text-sm">Collaboration Screenshot</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section id="features">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-jet-black mb-4">
              Everything you need to plan ahead
            </h2>
            <p className="text-pale-oak text-lg">
              Not another to-do app. SyncDays thinks in days, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="The Infinite Grid"
              description="Plan months ahead. See your whole year at a glance. Drag events like sticky notes. The day is your smallest unit."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Plan Together"
              description="Families, friend groups, coworkers. Share calendars without merging Google Calendars. Everyone stays in sync."
            />
            <FeatureCard
              icon={<ListTodo className="h-10 w-10" />}
              title="Track Your Backlog"
              description="Books, games, movies, TV shows. Your 'I'll get to it' list with time estimates. Finally, a place for your pile of shame."
            />
          </div>
        </Container>
      </Section>

      {/* Pro Features */}
      <Section className="bg-soft-linen/50">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandy-brown/20 text-sandy-brown text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Pro Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-jet-black mb-4">
              For the data nerds
            </h2>
            <p className="text-pale-oak text-lg">
              Optional features for those who want to track even more. Toggle them on or off anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-sandy-brown/10">
                  <CheckCircle className="h-6 w-6 text-sandy-brown" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-jet-black mb-2">Habit Tracking</h3>
                  <p className="text-pale-oak">
                    Check off your habits. Watch the streaks grow. Feel unreasonably proud of yourself.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-sandy-brown/10">
                  <Dumbbell className="h-6 w-6 text-sandy-brown" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-jet-black mb-2">Exercise Logging</h3>
                  <p className="text-pale-oak">
                    Workouts without the gym bro vibes. Log sets, track PRs, rest timers included.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-jet-black mb-4">
              Simple as 1, 2, 3
            </h2>
            <p className="text-pale-oak text-lg">
              Get started in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Drop events on the calendar",
                description: "Drag and drop to plan your days. See weeks and months at a glance.",
              },
              {
                step: "2",
                title: "Share with your people",
                description: "Invite family, friends, or coworkers to your shared calendars.",
              },
              {
                step: "3",
                title: "Track what matters",
                description: "Books, habits, workouts — everything in one place.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-sandy-brown text-jet-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-jet-black mb-2">{item.title}</h3>
                <p className="text-pale-oak">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="bg-soft-linen/50">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-jet-black mb-4">
              People are saying nice things
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally, a calendar that makes sense for our whole family. The kids can see what's planned without access to my work stuff.",
                name: "Sarah M.",
                role: "Mom of 3",
              },
              {
                quote: "My gaming backlog finally has a home. I can actually plan when I'll get to those games I bought on sale.",
                name: "Mike T.",
                role: "Gamer Dad",
              },
              {
                quote: "We use it to coordinate our friend group trips. So much easier than a 47-message WhatsApp thread.",
                name: "Jessica L.",
                role: "Trip Planner",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <p className="text-jet-black mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold text-jet-black">{testimonial.name}</p>
                  <p className="text-pale-oak text-sm">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Banner */}
      <Section className="bg-jet-black text-soft-linen">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to see your year at a glance?
            </h2>
            <p className="text-pale-oak text-lg mb-8">
              Join thousands of families and friends who plan their lives together.
            </p>
            <Button href="https://app.syncdays.com" size="lg" external>
              Start Free — No Credit Card Required <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
