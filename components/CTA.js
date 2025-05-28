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
    <section className="relative hero overflow-hidden min-h-screen flex items-center justify-center py-16">
      {/* Supademo embed as the main content */}
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 text-center text-black">
          See IndexWizard in Action
        </h2>
        <div style={{ 
          position: "relative", 
          boxSizing: "content-box",
          width: "100%", 
          aspectRatio: "2.2159763313609466", 
          margin: "0 auto",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          overflow: "hidden"
        }} className="md:h-[80vh] h-[85vh]">
          <iframe 
            src="https://app.supademo.com/embed/cmb8ctg2n04t7sn1rrovk1sea?embed_v=2" 
            loading="lazy" 
            title="Indexwizard Demo" 
            allow="clipboard-write" 
            frameBorder="0" 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true" 
            allowFullScreen 
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
};

export default CTA;
