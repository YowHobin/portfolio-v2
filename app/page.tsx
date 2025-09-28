import Hero from "@/components/pages/Hero";
import About from "@/components/pages/About";
import Bridge from "@/components/common/Bridge";
import Me from "@/components/pages/Me";
import Stacks from "@/components/pages/Stacks";
import Projects from "@/components/pages/Projects";
import Contact from "@/components/pages/Contact";

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
      <Bridge
        id="bridge2"
        height={{ base: 10, md: 30 }}
        className="mx-auto max-w-6xl px-4 py-6"
        items={[
          {
            text: "curious aren't we?",
            variant: "float",
            containerClassName:
              "w-full flex justify-center sm:justify-start px-2",
            textClassName:
              "text-3xl md:text-5xl font-bold tracking-tight break-words",
            scroll: {
              start: "top bottom",
              end: "center center",
              stagger: 0.05,
              scrub: 1.2,
              duration: 1,
            },
          },
          {
            text: "here is a little something!",
            variant: "float",
            containerClassName: "w-full flex justify-center  mt-2",
            textClassName:
              "text-3xl md:text-5xl font-bold tracking-tight break-words text-foreground",
            scroll: {
              start: "center center",
              end: "bottom bottom",
              stagger: 0.05,
              scrub: 3.2,
              duration: 1,
            },
          },
        ]}
      />
      <Me />

      {/* <Stacks />
      <Projects />
      <Contact /> */}
    </div>
  );
}
