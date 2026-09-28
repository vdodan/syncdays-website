"use client";

import { useEffect, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/public-config";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Header, Footer, Container, Section, Button, Card } from "@/components";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Load Turnstile once; the widget renders into .cf-turnstile automatically.
  useEffect(() => {
    if (document.querySelector('script[data-turnstile]')) return;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = "1";
    document.head.appendChild(s);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      setStatus("error");
      setError(
        res.status === 429
          ? "Too many messages in a short time. Please wait a minute and try again."
          : res.status === 403
            ? "We couldn't verify you're human. Please retry the check and send again."
            : "Your message could not be sent. Please email us at hello@syncdays.com instead."
      );
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    } catch {
      setStatus("error");
      setError("Network error. Please try again, or email hello@syncdays.com.");
    }
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

          {status === "sent" ? (
            <Card hover={false} className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-jet-black mb-2">Message sent!</h2>
              <p className="text-pale-oak">
                Thanks for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
            </Card>
          ) : (
            <Card hover={false}>
              <form onSubmit={handleSubmit} className="space-y-6" method="post" action="/api/contact">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-jet-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
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
                    name="email"
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
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pale-oak/30 bg-white/50 text-jet-black placeholder-pale-oak focus:outline-none focus:ring-2 focus:ring-sandy-brown/50 focus:border-sandy-brown resize-none"
                    placeholder="What's on your mind?"
                  />
                </div>

                {/* Honeypot: hidden from people, bots fill it in. */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <Button className="w-full" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? (
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
