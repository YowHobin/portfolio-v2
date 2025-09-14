import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative">
  <div className="mx-auto max-w-6xl px-4 py-16 w-full">
        <Reveal>
          <div className="text-center">
            <h2 className="section-title">About me</h2>
            <p className="section-subtitle mt-2">Crafting delightful products end‑to‑end</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-8 mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <p>
              I’m a full‑stack developer focused on building performant, accessible, and maintainable web apps. From API design to pixel‑perfect UI, I ship features with empathy for users and care for code quality.
            </p>
            <p>
              I value clarity, reliability, and thoughtful design. I enjoy collaborating with teams, mentoring, and always learning new tools that make development a joy.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
