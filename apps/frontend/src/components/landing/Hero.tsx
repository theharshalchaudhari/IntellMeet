import Link from "next/link";
import { HeroIllustration } from "../svg/HeroIllustration";

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Smart Meeting & Collaboration Platform
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Meeting outcomes that stay searchable, shareable, and actionable.
          </h1>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Capture meetings, summarize decisions, and keep the next steps organized without paying a hydration tax on the homepage.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/api/auth/google" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
              Join now
            </a>
            <Link href="#features" className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
              See features
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
          <HeroIllustration className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;