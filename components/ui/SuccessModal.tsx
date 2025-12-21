"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#476EAE', '#48B3AF', '#A7E399']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#476EAE', '#48B3AF', '#A7E399']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content - Split Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
            className="relative w-full max-w-3xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 z-20 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* LEFT SIDE: Animated SVG Illustration */}
            <div className="relative w-full md:w-5/12 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 flex items-center justify-center p-8 md:p-12 overflow-hidden min-h-[200px]">
              {/* Background Shapes */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ 
                  rotate: [0, -360],
                  scale: [1, 1.2, 1] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
              />

              {/* Animated Mail Icon */}
              <div className="relative z-10 w-full aspect-square max-w-[160px]">
                 <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="w-full h-full text-primary"
                 >
                   {/* Envelope Body */}
                   <motion.path
                     d="M3 7l9 6l9-6"
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: 1 }}
                     transition={{ duration: 1, delay: 0.2 }}
                   />
                   <motion.rect
                     x="3" y="5" width="18" height="14" rx="2"
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: 1 }}
                     transition={{ duration: 1, delay: 0 }}
                   />
                   
                   {/* Paper Plane Flying Out */}
                   <motion.path
                     d="M22 2L11 13M22 2l-7 20l-4-9l-9-4l20-7z"
                     initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                     animate={{ 
                        scale: [0, 1, 0.5], 
                        x: [0, -10, 40], 
                        y: [0, 10, -40],
                        opacity: [0, 1, 0]
                     }}
                     transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 1 }}
                     className="text-secondary fill-secondary/20"
                     style={{ originX: "50%", originY: "50%" }}
                   />
                 </motion.svg>
              </div>
            </div>

            {/* RIGHT SIDE: Content */}
            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-2">
                   <div className="h-1 w-8 bg-primary rounded-full" />
                   <span className="text-xs font-semibold uppercase tracking-wider text-primary">Success</span>
                </div>
                
                <h3 className="text-3xl font-bold tracking-tight mb-4">
                  Message Sent
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Thanks for reaching out! I&apos;ve received your message and will get back to you within 24 hours.
                </p>

              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
