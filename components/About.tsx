import ScrollFloat from "./common/ScrollFloat";

export default function About() {
  return (
    <section id="about" className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 w-full min-h-screen flex items-start justify-center">
        <ScrollFloat
          animationDuration={1.5}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.09}
          scrub={5.2}
          containerClassName="w-full flex justify-center"
          textClassName="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[11.5rem] font-extrabold tracking-tight w-full"
        >
          {`Full stack
       Developer`}
        </ScrollFloat>
      </div>
    </section>
  );
}
