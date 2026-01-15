"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Header, Footer, Container, Section, Button, Card } from "@/components";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In production, this would send to an API endpoint
    // For now, we'll just simulate the submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      <Header />

      <Section className="pt-32 sm:pt-40" animate={false}>
        <Container size="sm">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-jet-black mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-pale-oak">
              Have a question, feature request, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>

          {submitted ? (
            <Card hover={false} className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-jet-black mb-2">Message sent!</h2>
              <p className="text-pale-oak">
                Thanks for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
            </Card>
          ) : (
            <Card hover={false}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-jet-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pale-oak/30 bg-white/50 text-jet-black placeholder-pale-oak focus:outline-none focus:ring-2 focus:ring-sandy-brown/50 focus:border-sandy-brown"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-jet-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pale-oak/30 bg-white/50 text-jet-black placeholder-pale-oak focus:outline-none focus:ring-2 focus:ring-sandy-brown/50 focus:border-sandy-brown"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-jet-black mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pale-oak/30 bg-white/50 text-jet-black placeholder-pale-oak focus:outline-none focus:ring-2 focus:ring-sandy-brown/50 focus:border-sandy-brown resize-none"
                    placeholder="What's on your mind?"
                  />
                </div>

                <Button className="w-full" onClick={() => {}}>
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          )}

          {/* Alternative Contact */}
          <div className="mt-12 text-center">
            <p className="text-pale-oak mb-4">Or reach us directly:</p>
            <a
              href="mailto:hello@syncdays.com"
              className="inline-flex items-center gap-2 text-jet-black hover:text-sandy-brown transition-colors"
            >
              <Mail className="h-5 w-5" />
              hello@syncdays.com
            </a>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
