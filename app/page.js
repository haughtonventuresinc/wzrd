import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Testimonial from "@/components/Testimonials1";
import FeaturesListicle from "@/components/FeaturesListicle";
import Solutions from "@/components/Solution";
import Testimonial1Small from "@/components/Testimonial1Small";
import TestimonialRating from "@/components/TestimonialRating";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";

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
