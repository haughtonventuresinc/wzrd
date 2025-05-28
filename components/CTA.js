import React from "react";
import Image from "next/image";
import config from "@/config";
import feature from "@/app/feature.gif";

const FeatureCard = ({ title, description, image }) => {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-black mt-2 mb-2 md:mb-1  0">
      <div className="p-6">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        <p className="text-white">{description}</p>
      </div>
    </div>
  );
};

const CTA = () => {
  return (
    <section className="w-full h-screen">
      <iframe 
        src="https://app.supademo.com/embed/cmb8ctg2n04t7sn1rrovk1sea?embed_v=2" 
        loading="lazy" 
        title="Indexwizard Demo" 
        allow="clipboard-write" 
        frameBorder="0" 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        allowFullScreen 
        className="w-full h-full"
      />
    </section>
  );
};

export default CTA;
