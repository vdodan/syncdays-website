"use client";

import { Calendar, Users, ListTodo, Dumbbell, CheckCircle, ArrowRight } from "lucide-react";
import { Header, Footer, Container, Section, Button, Card } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* Hero Section */}
      <Section className="pt-32 sm:pt-40 pb-20" animate={false}>
        <Container>
          <div className="max-w-4xl">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">Life planning made simple</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium text-black leading-[1.1] mb-6">
              Plan your life{" "}
              <span className="accent-text">together</span>
            </h1>
            <p className="text-lg text-muted mb-8 max-w-xl leading-relaxed">
              The shared calendar for families, friends, and anyone who doesn&apos;t want to merge Google Calendars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="https://app.syncdays.com" size="lg" external>
                Start Free
              </Button>
              <Button href="#features" variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Screenshot Section */}
      <Section className="py-0 pb-20">
        <Container>
          <div className="bg-warm-beige rounded-3xl p-8 sm:p-12">
            <div className="aspect-[16/9] bg-tan/30 rounded-2xl flex items-center justify-center">
              <div className="text-center text-muted">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-40" />
                <p className="text-sm">App Screenshot Coming Soon</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Collaboration Section - Hero Feature */}
      <Section className="bg-warm-beige">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-sm text-muted mb-4 uppercase tracking-wide">Collaboration</p>
              <h2 className="text-4xl sm:text-5xl font-medium text-black leading-tight mb-6">
                Share what matters,<br />
                keep what&apos;s{" "}
                <span className="accent-text">private</span>
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                No more &quot;wait, I thought YOU were picking up the kids.&quot; Create shared calendars
                for your family, friend groups, or coworkers.
              </p>
              <ul className="space-y-4">
                {[
                  "Create unlimited shared calendars",
                  "Invite family, friends, or coworkers",
                  "Each person keeps their private events",
                  "Real-time sync across all devices",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-black">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-tan/40 rounded-3xl aspect-square flex items-center justify-center">
              <div className="text-center text-muted">
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
          <div className="max-w-2xl mb-16">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">Features</p>
            <h2 className="text-4xl sm:text-5xl font-medium text-black leading-tight">
              Everything you need to{" "}
              <span className="accent-text">plan ahead</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="beige">
              <Calendar className="h-8 w-8 mb-6 text-black" />
              <h3 className="text-xl font-medium mb-3 text-black">The Infinite Grid</h3>
              <p className="text-muted leading-relaxed">
                Plan months ahead. See your whole year at a glance. Drag events like sticky notes.
              </p>
            </Card>
            <Card variant="beige">
              <Users className="h-8 w-8 mb-6 text-black" />
              <h3 className="text-xl font-medium mb-3 text-black">Plan Together</h3>
              <p className="text-muted leading-relaxed">
                Families, friend groups, coworkers. Share calendars without merging Google Calendars.
              </p>
            </Card>
            <Card variant="beige">
              <ListTodo className="h-8 w-8 mb-6 text-black" />
              <h3 className="text-xl font-medium mb-3 text-black">Track Your Backlog</h3>
              <p className="text-muted leading-relaxed">
                Books, games, movies, TV shows. Your &apos;I&apos;ll get to it&apos; list with time estimates.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Pro Features */}
      <Section className="bg-warm-beige">
        <Container>
          <div className="max-w-2xl mb-16">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">Pro Features</p>
            <h2 className="text-4xl sm:text-5xl font-medium text-black leading-tight">
              For the{" "}
              <span className="accent-text">data nerds</span>
            </h2>
            <p className="text-muted text-lg mt-6 leading-relaxed">
              Optional features for those who want to track even more. Toggle them on or off anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-warm-beige">
                  <CheckCircle className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Habit Tracking</h3>
                  <p className="text-muted">
                    Check off your habits. Watch the streaks grow. Feel unreasonably proud.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-warm-beige">
                  <Dumbbell className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Exercise Logging</h3>
                  <p className="text-muted">
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
          <div className="max-w-2xl mb-16">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-medium text-black leading-tight">
              Simple as{" "}
              <span className="accent-text">1, 2, 3</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Drop events on the calendar",
                description: "Drag and drop to plan your days. See weeks and months at a glance.",
              },
              {
                step: "02",
                title: "Share with your people",
                description: "Invite family, friends, or coworkers to your shared calendars.",
              },
              {
                step: "03",
                title: "Track what matters",
                description: "Books, habits, workouts — everything in one place.",
              },
            ].map((item, index) => (
              <div key={index}>
                <span className="text-5xl font-light text-tan mb-4 block">{item.step}</span>
                <h3 className="text-xl font-medium text-black mb-3">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="bg-warm-beige">
        <Container>
          <div className="max-w-2xl mb-16">
            <p className="text-sm text-muted mb-4 uppercase tracking-wide">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-medium text-black leading-tight">
              People are saying{" "}
              <span className="accent-text">nice things</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                <span className="quote-mark">&ldquo;</span>
                <p className="text-black mb-6 -mt-4">{testimonial.quote}</p>
                <div className="pt-4 border-t border-tan/30">
                  <p className="font-medium text-black">{testimonial.name}</p>
                  <p className="text-muted text-sm">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Banner */}
      <Section className="bg-black text-white">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm text-white/50 mb-4 uppercase tracking-wide">Get started</p>
            <h2 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
              Your planning journey starts{" "}
              <span className="accent-text">right here</span>
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Join thousands of families and friends who plan their lives together.
            </p>
            <Button href="https://app.syncdays.com" variant="secondary" size="lg" external>
              Start Free — No Credit Card <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
