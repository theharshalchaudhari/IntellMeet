import Image from "next/image";
import Link from "next/link";

export default function Section() {
  return (
    <section className="grid min-h-[60vh] w-full items-center gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          A lighter static surface for the public site.
        </h2>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          Heavy systems like meeting rooms, editors, and realtime views should stay route-local. The marketing shell should stay instant.
        </p>
        <Link href="/api/auth/google" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Get started
        </Link>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <Image src="/Logo.svg" alt="IntellMeet logo" width={900} height={900} className="h-auto w-full" />
      </div>
    </section>

  );
}