import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Bot, CheckCircle2, ChartColumnBig, LayoutGrid, MessagesSquare, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { HeroIllustration } from "@/components/svg/HeroIllustration";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Smart meeting workspace for AI summaries and action items",
  description:
    "IntellMeet is a static-first marketing homepage for the meeting workspace that organizes live collaboration, AI summaries, transcripts, and action items.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smart meeting workspace for AI summaries and action items",
    description:
      "Run collaborative meetings, capture transcripts, and keep AI-generated action items in one fast workspace.",
    url: "/",
    images: ["/Logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart meeting workspace for AI summaries and action items",
    description:
      "Collaborative meetings with transcripts, summaries, and action tracking.",
    images: ["/Logo.svg"],
  },
};

const featureCards = [
  {
    icon: MessagesSquare,
    title: "Meeting collaboration",
    description:
      "Keep every conversation, note, and next step in one shared workspace.",
  },
  {
    icon: Bot,
    title: "AI summaries",
    description:
      "Turn long meetings into concise summaries with decisions and follow-ups.",
  },
  {
    icon: ChartColumnBig,
    title: "Team visibility",
    description:
      "Surface tasks, participation, and meeting output without extra dashboards.",
  },
  {
    icon: Workflow,
    title: "Action items",
    description:
      "Keep work moving with clear ownership, deadlines, and searchable history.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Use a production-ready app shell with safe routing, auth, and private workspaces.",
  },
  {
    icon: Sparkles,
    title: "Fast to adopt",
    description:
      "Start in the browser, then grow into meetings, analytics, and workspace management.",
  },
];

const faqItems = [
  {
    question: "What is IntellMeet built for?",
    answer:
      "IntellMeet is built for teams that need meetings, AI summaries, action items, and collaboration in one product instead of across disconnected tools.",
  },
  {
    question: "Does the landing page stay lightweight?",
    answer:
      "Yes. The public homepage is server-rendered, static, and intentionally avoids importing the meeting, realtime, or analytics systems that belong behind auth.",
  },
  {
    question: "Can teams find meeting notes later?",
    answer:
      "Yes. The product is designed around searchable transcripts, summaries, and tasks so decisions stay easy to recover.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "IntellMeet",
      url: "/",
      logo: "/Logo.svg",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      name: "IntellMeet",
      url: "/",
      potentialAction: {
        "@type": "SearchAction",
        target: "/meetings?query={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "IntellMeet",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A meeting workspace for live collaboration, AI summaries, transcripts, and action items.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Landing() {
  return (
    <main className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%),linear-gradient(180deg,_rgba(7,10,18,0)_0%,_rgba(7,10,18,0.25)_100%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Production-grade meeting workspace for fast teams
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Smart meetings, AI summaries, and action items in one workspace.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                IntellMeet keeps the public homepage lightweight while the product
                handles live collaboration, transcripts, task tracking, and team
                analytics behind the scenes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/api/auth/google"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Explore features
              </a>
            </div>

            <dl className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Static marketing shell", "Server-rendered"],
                ["Interactive product", "Scoped to app routes"],
                ["SEO readiness", "Metadata + structured data"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur">
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
                  <dd className="mt-2 text-lg font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] border border-border/60 bg-background/80 p-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  What the product does
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                  Capture the conversation, summarize it with AI, turn decisions into
                  tasks, and keep the workspace ready for the next meeting.
                </p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                <div className="rounded-[1.5rem] border border-border/60 bg-background p-5">
                  <h3 className="text-lg font-semibold">Realtime collaboration</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    The app routes contain the realtime systems. The homepage never
                    loads them, which keeps first paint fast and avoids unnecessary
                    hydration.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-border/60 bg-background p-4">
                  <Image
                    src="/icons/Folder.svg"
                    alt="Workspace dashboard illustration"
                    width={1800}
                    height={900}
                    className="h-auto w-full select-none"
                    priority
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="rounded-2xl bg-background px-4 py-3">AI summaries</div>
                <div className="rounded-2xl bg-background px-4 py-3">Action items</div>
                <div className="rounded-2xl bg-background px-4 py-3">Searchable transcripts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for teams that need the meeting outcome, not more meeting noise.
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            Every section below is static, crawlable, and readable without JavaScript.
            The interactive systems stay in route-level chunks where they belong.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A rendering strategy that favors speed, SEO, and stability.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              The public site is static-first, while app features hydrate only when
              a user reaches a route that genuinely needs state, media, or realtime.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["1. Server-render the shell", "The header, hero, and copy ship without client JS."],
              ["2. Hydrate only interactive islands", "Auth, media, realtime, and editors stay scoped."],
              ["3. Defer heavy systems", "Meeting rooms, analytics, and collaboration tools stay route-local."],
              ["4. Keep crawlers happy", "Metadata, sitemap, robots, and JSON-LD describe the site."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-border/60 bg-background p-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            The content is crawlable and machine-readable, which helps both search engines and LLMs understand the product.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="group rounded-3xl border border-border/60 bg-card/70 p-6">
              <summary className="cursor-pointer list-none text-lg font-medium outline-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/60 bg-primary px-6 py-10 text-primary-foreground sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Start with the public shell, then move into the full workspace.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-primary-foreground/80">
                The homepage stays fast for crawlers and mobile users, and the product routes keep the heavier collaboration systems isolated from the marketing path.
              </p>
            </div>

            <a
              href="/api/auth/google"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-6 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}