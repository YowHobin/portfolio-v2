import Hero from "@/components/Hero";
import About from "@/components/About";
import Stacks from "@/components/Stacks";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <About />
      <Stacks />
      <Projects />
      <Contact />
    </div>
  );
}
