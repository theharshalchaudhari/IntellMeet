
export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Wraith Themes Runtime Test
          </h1>

          <p className="text-muted-foreground mt-2">
            Dynamic tweakcn theme switching
          </p>
        </div>


        <div className="border-border bg-card text-card-foreground rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Theme Card
          </h2>

          <p className="text-muted-foreground mt-2">
            If themes switch correctly, this card should update live.
          </p>
        </div>

        <div className="bg-primary text-primary-foreground rounded-xl px-6 py-4">
          Primary Theme Surface
        </div>

        <div className="bg-secondary text-secondary-foreground rounded-xl px-6 py-4">
          Secondary Theme Surface
        </div>

        <div className="bg-accent text-accent-foreground rounded-xl px-6 py-4">
          Accent Theme Surface
        </div>
      </div>
    </main>
  );
}