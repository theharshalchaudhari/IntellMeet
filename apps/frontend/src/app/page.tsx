"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Hero from "@/components/landing/Hero";
import Card from "@/components/landing/Card";
import Features from "@/components/landing/Features";
import Section from "@/components/landing/Section";
import Screen from "@/components/landing/Screen";
import { Header } from "@/components/common/Header";


export default function Landing() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Clean up OAuth error params from URL
    if (searchParams.has("error") || searchParams.has("error_code") || searchParams.has("auth")) {
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <main className="pt-24">
      <Header />

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