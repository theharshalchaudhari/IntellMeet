import Hero from "@/components/landing/Hero";
import Card from "@/components/landing/Card";
import Features from "@/components/landing/Features";
import Section from "@/components/landing/Section";
import Screen from "@/components/landing/Screen";

export default function Landing() {
  return (
    <main>
      <Hero />

      <Card>
        <Features />
        <Section/>
        <Section/>
        <Section/>
      </Card>
    </main>
  );
}