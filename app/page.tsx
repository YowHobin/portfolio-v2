import Hero from "@/components/pages/Hero";
import Bridge from "@/components/common/Bridge";
import Me from "@/components/pages/Me";
import Stacks from "@/components/pages/Stacks";
import Projects from "@/components/pages/Projects";
import About from "@/components/pages/About";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <Bridge
        id="bridge"
        height={{ base: 10, md: 30 }}
        className="mx-auto max-w-6xl px-4 py-6"
        items={[
          {
            text: "is",
            variant: "float",
            containerClassName:
              "w-full flex justify-center sm:justify-end px-2",
            textClassName: "text-3xl md:text-6xl font-bold tracking-tight",
            scroll: {
              start: "top bottom",
              end: "bottom top",
              stagger: 0.05,
              scrub: 1.2,
              duration: 1,
            },
          },
          {
            text: "a",
            variant: "float",
            containerClassName: "w-full flex justify-center mt-2",
            textClassName: "text-3xl md:text-6xl font-bold tracking-tight",
            scroll: {
              start: "top bottom",
              end: "bottom top",
              stagger: 0.05,
              scrub: 1.2,
              duration: 1,
            },
          },
        ]}
      />
      <About />
      <Me />
      <Bridge
        id="bridge3"
        height={{ base: 10, md: 30 }}
        className="mx-auto max-w-6xl px-4 py-6"
        items={[
          {
            text: "Come on! Don't bore us now. Take us to the good stuff!",
            variant: "float",
            containerClassName: "w-full text-center px-2",
            textClassName:
              "text-3xl md:text-5xl font-bold tracking-tight break-words",
            scroll: {
              start: "top bottom",
              end: "center center",
              stagger: 0.05,
              scrub: 1.2,
              duration: 1,
            },

            annotations: [
              {
                phrase: "Don't bore us",
                action: "highlight",
                colorLight: "var(--brand-primary)",
                colorDark: "#fde68a",
                strokeWidth: 2,
                animationDuration: 600,
                padding: 2,
                multiline: false,
              },
              {
                phrase: "good stuff",
                action: "underline",
                colorLight: "var(--brand-tertiary)",
                colorDark: "#fbbf24",
                strokeWidth: 2.5,
                animationDuration: 600,
                padding: 3,
                multiline: false,
              },
            ],
          },
        ]}
      />
      <Stacks />
      <Bridge
        id="bridge4"
        
        height={{ base: 10, md: 15 }}
        className="mx-auto max-w-6xl px-4 "
        items={[
          {
            text: "Jack of all trades, master of none?",
            variant: "float",
            containerClassName: "w-full text-center sm:text-start px-2",
            textClassName:
              "text-3xl md:text-5xl font-bold tracking-tight break-words",
            scroll: {
              start: "top bottom",
              end: "center center",
              stagger: 0.05,
              scrub: 1.2,
              duration: 1,
            },

            annotations: [
              {
                phrase: "master of none?",
                action: "highlight",
                colorLight: "var(--brand-primary)",
                colorDark: "#fde68a",
                strokeWidth: 2,
                animationDuration: 600,
                padding: 2,
                multiline: false,
              },
            ],
          },
        ]}
      />
      <Bridge
        id="bridge5"
        className="mx-auto max-w-6xl px-4 py-3"
        items={[
          {
            text: "though oftentimes better than master of one.",
            variant: "float",
            containerClassName: "w-full text-center sm:text-end px-2",
            textClassName:
              "text-3xl md:text-5xl font-bold tracking-tight break-words",
            scroll: {
              start: "top bottom",
              end: "center center",
              stagger: 0.05,
              scrub: 1.2,
              duration: 1,
            },

            annotations: [
              {
                phrase: "better",
                action: "circle",
                colorLight: "var(--brand-tertiary)",
                colorDark: "#fbbf24",
                strokeWidth: 2.5,
                animationDuration: 600,
                padding: 3,
                multiline: false,
              },
              {
                phrase: "master of one",
                action: "underline",
                colorLight: "var(--brand-primary)",
                colorDark: "#fde68a",
                strokeWidth: 2,
                animationDuration: 600,
                padding: 2,
                multiline: false,
              },
            ],
          },
        ]}
      />
      {/* <Stacks />
      <Projects />
      <Contact /> */}
    </div>
  );
}
