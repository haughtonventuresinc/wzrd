"use client";

import config from "@/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import "./style.css";

const Pricing = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  const addPaypalScript = () => {
    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=Ac_Y6w5AyvIjDM7uTK2ksmdQ4nuYHJEgTY4xjI91I8wv-3zKPkmhcPE2MkmXd7okZzxCeJkrUiS3Jt68";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    addPaypalScript();
  }, []);

  // useEffect(() => {
  //   const buyerName = localStorage.getItem("buyerName");
  //   if (buyerName) {
  //     router.push("/dashboard");
  //   }
  // }, []);

  const handlePaymentSuccess = async (details, data) => {
    const email = details.payer.email_address;
    const givenName = details.payer.name.given_name;

    // Display an alert with the payer's given name
    alert(`Transaction completed by ${givenName}`);

    // Store the payer's given name in local storage
    localStorage.setItem("buyerName", givenName);

    // Optional: Store additional transaction details in local storage
    localStorage.setItem("payerEmail", email);

    // Make an Axios call to save the email address in the database
    try {
      await axios.post("https://backend.indexwzrd.com/api/v1/pricing/save", {
        email,
      });
    } catch (error) {
      console.error("Error saving email to database:", error);
    }

    // Navigate to the dashboard
    router.push("/login");
  };

  return (
    <section className="bg-white overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-bold text-3xl lg:text-5xl text-black mb-8">
            Pricing
          </p>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan) => (
            <div key={plan.priceId} className="relative w-full max-w-lg">
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span
                    className={`badge text-xs text-black font-semibold border-0 bg-[#98a5b6]`}
                  >
                    POPULAR
                  </span>
                </div>
              )}

              {plan.isFeatured && (
                <div
                  className={`absolute -inset-[1px] rounded-[9px] bg z-10`}
                ></div>
              )}

              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-white text-black border p-8 rounded-lg shadow-2xl">
                <div className="flex justify-between items-center gap-4 ">
                  <div>
                    <p className="text-lg lg:text-xl font-bold">{plan.name}</p>
                    {plan.description && (
                      <p className="text-black mt-2">{plan.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[4px] text-lg ">
                      <p className="relative">
                        <span className="absolute bg-black h-[1.5px] inset-x-0 top-[53%]"></span>
                        <span className="text-black">${plan.priceAnchor}</span>
                      </p>
                    </div>
                  )}
                  <p className={`text-5xl tracking-tight font-extrabold`}>
                    ${plan.price}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-black uppercase font-semibold">
                      USD
                    </p>
                  </div>
                </div>
                {plan.features && (
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-2">
                  {scriptLoaded ? (
                    <PayPalButton
                      amount={plan.price}
                      onSuccess={handlePaymentSuccess}
                    />
                  ) : (
                    <span>Loading....</span>
                  )}
                  <p className="flex items-center justify-center gap-2 text-sm text-center text-black font-medium relative">
                    Monthly Charges
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
