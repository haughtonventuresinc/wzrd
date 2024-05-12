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

// const initialOptions = {
//   clientId:
//     "Ac_Y6w5AyvIjDM7uTK2ksmdQ4nuYHJEgTY4xjI91I8wv-3zKPkmhcPE2MkmXd7okZzxCeJkrUiS3Jt68",
//   currency: "USD",
//   intent: "capture",
// };

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
        {/* <PayPalScriptProvider options={initialOptions}> */}
          <Pricing />
          {/* <PayPalButtons /> */}
        {/* </PayPalScriptProvider> */}
        <CTA />
        <FAQ />
        <Testimonials11 />
      </main>
      <Footer />
    </>
  );
}
