import Hero from "@/components/landing/Hero";
import Card from "@/components/landing/Card";
import Section from "@/components/landing/Section";

export default function Page() {
  return (
    <main>
      <Hero />

      <Card>
        <Section />
        <Section />
        <Section />
      </Card>
    </main>
  );
}