export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Your workspace dashboard will surface meeting activity, tasks, and summaries. The shell stays server-rendered so private app routes avoid unnecessary client work until a feature truly needs it.
        </p>
      </div>
    </section>
  );
}