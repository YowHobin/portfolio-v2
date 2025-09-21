import Hero from "@/components/Hero";
import About from "@/components/About";
import Bridge from "@/components/Bridge";
import Stacks from "@/components/Stacks";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <Bridge
        id="bridge"
        height={{ base: 10, md: 50 }}
        className="mx-auto max-w-6xl px-4 py-6"
        items={[
          {
            text: "is",
            variant: "float",
            containerClassName: "w-full flex justify-end px-2",
            textClassName: "text-6xl lg:text-5xl font-bold tracking-tight",
            scroll: { start: "top bottom", end: "bottom top", stagger: 0.05, scrub: 1.2, duration: 1 }
          },
          {
            text: "a",
            variant: "float",
            containerClassName: "w-full flex justify-center mt-2",
            textClassName: "text-6xl lg:text-5xl font-bold tracking-tight",
            scroll: { start: "top bottom", end: "bottom top", stagger: 0.05, scrub: 1.2, duration: 1 }
          }
        ]}
      />
      <About />
      {/* <Stacks />
      <Projects />
      <Contact /> */}
    </div>
  );
}
