import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import hero from "@/app/wizardgpt.gif";
// import video from "../app/video.mp4";

const Hero = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto text-black flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
        <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
          <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
            Trade smarter, faster <br /> - beat the market daily
          </h1>
          <p className="text-lg opacity-80 leading-relaxed">
            Index wizard delivers real-time trading insights for SPX and SPY,
            tailored to day traders. From setup to strategy execution in
            minutes, optimize your trading decisions and stay ahead of the
            market.
          </p>
          <button className="btn bg-black btn-wide text-white hover:text-black">
            Join {config.appName}
          </button>

          <TestimonialsAvatars priority={true} />
        </div>
        <div className="lg:w-ful">
          <video controls>
            <source src={video}></source>
          </video>
          {/* <Image
            src={hero}
            alt="Product Demo"
            className="w-[600px]"
            priority={true}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
