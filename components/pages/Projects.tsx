"use client";

import Reveal from "../ui/Reveal";
import CountUp from "../CountUp";

export default function Projects() {
  return (
    <section id="projects" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 w-full">

        <Reveal>
          <div className="max-w-2xl">
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle mt-2">
              A quick snapshot of the work that actually shipped.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 items-stretch">
          <div className="grid gap-6">
            <article className="glass rounded-[32px] border border-foreground/12 bg-background/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-foreground/45">
                  Minor projects
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <CountUp
                    to={3}
                    className="text-4xl sm:text-5xl font-semibold tracking-tight"
                  />
                  <span className="text-sm text-foreground/60">shipped builds</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">
                Tight, well-scoped implementations used to explore ideas fast
                without cutting corners on quality.
              </p>
            </article>

            <article className="glass rounded-[32px] border border-foreground/12 bg-background/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-foreground/45">
                  Side project
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <CountUp
                    to={1}
                    className="text-4xl sm:text-5xl font-semibold tracking-tight"
                  />
                  <span className="text-sm text-foreground/60">active build</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">
                A long-running playground to try new stacks in production
                before they land in client work.
              </p>
            </article>
          </div>

          <article className="relative overflow-hidden rounded-[32px] border border-foreground/12 bg-background/95 p-6 sm:p-10 flex flex-col justify-between md:row-span-2">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 opacity-80"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-background/70">
                Major projects
              </p>
              <div className="flex items-baseline gap-3">
                <CountUp
                  to={7}
                  className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-background"
                />
                <span className="text-sm font-medium text-background/80">
                  end-to-end deliveries
                </span>
              </div>
              <p className="max-w-md text-sm text-background/80">
                Full-stack products taken from first commit to production:
                architecture, implementation, testing, deployment, and the
                unglamorous maintenance work that keeps everything stable.
                These are the projects with real users, real constraints, and
                long-term ownership—not just prototypes.
              </p>
            </div>
          </article>
        </div>
      </div>

    </section>
  );
}