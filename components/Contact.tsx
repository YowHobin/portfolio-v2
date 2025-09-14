"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const MAX_MSG = 1000 as const;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("Please fill in all fields.");
      return;
    }
    if (message.length > MAX_MSG) {
      setStatus("Message is too long.");
      return;
    }
    const params = new URLSearchParams({
      subject: `Portfolio contact from ${name}`,
      body: message,
    });
    window.location.href = `mailto:you@example.com?${params.toString()}`;
  };

  return (
    <section id="contact" className="relative">
  <div className="mx-auto max-w-6xl px-4 py-16 w-full">
        <Reveal>
          <div>
            <h2 className="section-title">Contact me</h2>
            <p className="section-subtitle mt-2">Let’s build something great together</p>
          </div>
        </Reveal>
        <form onSubmit={handleSubmit} className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="md:col-span-1 flex flex-col gap-4">
            <label className="text-sm" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl px-4 py-3 bg-muted border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Your name"
              required
            />
            <label className="text-sm" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl px-4 py-3 bg-muted border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <label className="text-sm" htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-40 rounded-xl px-4 py-3 bg-muted border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Tell me about your project"
              maxLength={MAX_MSG}
              required
            />
          </div>
          <Reveal>
            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">I usually reply within 24 hours.</p>
              <button type="submit" className="px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-medium border border-transparent hover:opacity-90">
                Send Message
              </button>
            </div>
          </Reveal>
          {status && (
            <div className="md:col-span-2 text-sm text-accent">{status}</div>
          )}
        </form>
      </div>
    </section>
  );
}
