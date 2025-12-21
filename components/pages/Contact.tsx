"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../ui/Reveal";
import { sendEmail } from "@/app/actions/send-email";
import SuccessModal from "../ui/SuccessModal";
import { SparklesText } from "../ui/sparkles-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MAX_MSG = 1000 as const;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sparklesVisible, setSparklesVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current || !sectionRef.current) return;

    const title = titleRef.current;
    gsap.set(title, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
        setSparklesVisible(true);
      },
      onLeave: () => setSparklesVisible(false),
      onEnterBack: () => setSparklesVisible(true),
      onLeaveBack: () => setSparklesVisible(false)
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

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

    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    try {
      const result = await sendEmail(formData);

      if (result.error) {
        setStatus(result.error);
      } else {
        setShowSuccessModal(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 dark:opacity-30 transition-opacity duration-300" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 60rem at 50% -10%, color-mix(in oklch, var(--brand-primary) 18%, transparent), transparent 60%), " +
            "radial-gradient(40rem 40rem at 80% 20%, color-mix(in oklch, var(--brand-secondary) 14%, transparent), transparent 70%), " +
            "radial-gradient(50rem 50rem at 20% 80%, color-mix(in oklch, var(--brand-tertiary) 10%, transparent), transparent 70%)",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 w-full grid xl:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Title & Info */}
        <div className="relative z-10">
          <div className="relative mb-12">
             <h2
              ref={titleRef}
              className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50"
            >
              Get in<br />Touch.
            </h2>
            {sparklesVisible && (
              <div className="absolute -top-10 -left-10 opacity-50 pointer-events-none">
                 <SparklesText className="text-6xl"> </SparklesText>
              </div>
            )}
          </div>
          
          <Reveal>
            <div className="space-y-8">
              <p className="text-xl text-muted-foreground max-w-md font-light leading-relaxed">
                Have a project in mind? Let&apos;s create something that pushes boundaries and creates real value.
              </p>
              
              <div className="flex flex-col gap-4">
                <a href="mailto:lenardroyarellano@gmail.com" className="group flex items-center gap-4 text-lg hover:text-primary transition-colors">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span>lenardroyarellano@gmail.com</span>
                </a>
                <div className="flex items-center gap-4 text-lg text-muted-foreground">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <span>Response time: ~24 hours</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Side: Minimalist Form */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2rem] blur-2xl opacity-50" />
          <div className="relative bg-background/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-muted-foreground ml-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary/5 border border-border/50 rounded-xl px-4 py-3 text-lg outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/30"
                    placeholder="What should I call you?"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary/5 border border-border/50 rounded-xl px-4 py-3 text-lg outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/30"
                    placeholder="Where can I reach you?"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-muted-foreground ml-1">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-secondary/5 border border-border/50 rounded-xl px-4 py-3 text-lg outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 min-h-[160px] resize-none placeholder:text-muted-foreground/30"
                      placeholder="Tell me about your project..."
                      maxLength={MAX_MSG}
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm border border-border/50">
                      {message.length}/{MAX_MSG}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group relative px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2 text-base">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    )}
                  </span>
                </button>
              </div>

              {status && (
                <div className={`p-4 rounded-xl text-sm text-center font-medium ${status.includes("successfully") ? "text-green-600 bg-green-500/10 border border-green-500/20" : "text-red-500 bg-red-500/10 border border-red-500/20"}`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
