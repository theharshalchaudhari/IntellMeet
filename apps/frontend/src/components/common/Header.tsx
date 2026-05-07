export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-3 font-semibold tracking-tight text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              I
            </span>
            <span className="hidden text-base sm:inline-flex">IntellMeet</span>
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/auth/google"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Get started
          </a>

          <a
            href="/dashboard"
            className="hidden h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Dashboard
          </a>
        </div>
      </div>

      <details className="border-t border-border/40 md:hidden">
        <summary className="list-none px-4 py-3 text-sm font-medium text-muted-foreground [&::-webkit-details-marker]:hidden">
          <span className="sr-only">Open navigation</span>
          Menu
        </summary>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-4 text-sm text-muted-foreground">
          <a href="#features" className="rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-foreground">
            How it works
          </a>
          <a href="#faq" className="rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-foreground">
            FAQ
          </a>
          <a href="#pricing" className="rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-foreground">
            Pricing
          </a>
        </div>
      </details>
    </header>
  );
}