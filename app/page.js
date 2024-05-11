import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Solutions from "@/components/Solution";
import Testimonials11 from "@/components/Testimonials11";

export default function Page() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        <Problem />
        <Solutions />
        <Pricing />
        <CTA />
        <FAQ />
        <Testimonials11 />
      </main>
      <Footer />
    </>
  );
}
