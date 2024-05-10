"use client";

import { useRef, useState } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "What does Index wizard offer?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Index wizard offers cutting-edge predictive analytics for day traders,
        focusing on the SPX and SPY indices. Our platform provides daily market
        directions, price targets, and real-time alerts using our proprietary
        algorithm, helping traders make informed decisions quickly.
      </div>
    ),
  },
  {
    question: "How do I use Index wizard services?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        After signing up and choosing your subscription plan, you’ll gain access
        to our user dashboard. Every trading day, before the market opens, we’ll
        provide clear market directions and price targets. You’ll receive alerts
        on significant market movements, accessible directly through our
        platform.
      </div>
    ),
  },
  {
    question: "What markets do you cover?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Currently, Index wizard specializes in the SPX and SPY indices. These
        indices provide a dynamic trading environment, and our service is
        designed to capitalize on this by offering precise predictions and
        analyses.
      </div>
    ),
  },
  {
    question: "How much does it cost to subscribe to Index wizard?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Index wizard offers several subscription plans tailored to different
        trading needs. Our standard plan starts at $200 per month. For more
        detailed information, please visit our Pricing page.
      </div>
    ),
  },
  {
    question: "What makes Index wizard different from other trading tools?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Index wizard sets itself apart by providing not just data, but
        processed, actionable insights tailored to day trading SPX and SPY. Our
        algorithms are backed by rigorous data science and are continuously
        updated to adapt to market conditions.
      </div>
    ),
  },
  {
    question: "How accurate are your predictions?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        While no predictive tool can guarantee absolute accuracy, Index wizard
        strives to maintain the highest standards of data integrity and
        analytical precision. Our historical performance and ongoing
        improvements aim to provide reliability and trust in our predictions.
      </div>
    ),
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Yes, you can cancel your subscription at any time through your account
        settings. There are no cancellation fees, though we do not offer refunds
        for any remaining time in your subscription period.
      </div>
    ),
  },
  {
    question: "How can I contact customer support?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Our dedicated customer support team can be reached via email at
        <a href="mailto:support@Index wizard.com" className="text-blue-600">
          {" "}
          support@Index wizard.com
        </a>{" "}
        or through our website’s contact form. We strive to respond to all
        inquiries within 24 hours.
      </div>
    ),
  },
  {
    question: "What payment methods do you accept?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Index wizard accepts payments via major credit cards and PayPal. All
        payments are securely processed on our platform.
      </div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span className={`flex-1 text-white ${isOpen ? "text-primary" : ""}`}>
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-black text-white-400" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-white mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-white">
            Frequently Asked Questions for Index wizard
          </p>
        </div>

        <ul className="basis-1/2 text-white">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
