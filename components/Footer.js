import TrackingLink from "./TrackingLink";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.mailgun.supportEmail, the link won't be displayed.

const Footer = () => {
  return (
    <footer className="bg-white border-t border-base-content/10 text-black">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className=" flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <TrackingLink
              href="/#"
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                priority={true}
                className="w-12 h-12 bg-black rounded"
                width={34}
                height={34}
              />
              <strong className="font-extrabold tracking-tight text-base md:text-lg">
                {config.appName}
              </strong>
            </TrackingLink>

            <p className="mt-3 text-sm text-black">{config.appDescription}</p>
            <p className="mt-3 text-sm text-black">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-black tracking-widest text-sm md:text-left mb-3">
                LINKS
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                {config.mailgun.supportEmail && (
                  <a
                    href={`mailto:${config.mailgun.supportEmail}`}
                    target="_blank"
                    className="link link-hover"
                    aria-label="Contact Support"
                  >
                    Support
                  </a>
                )}
                <TrackingLink href="/#pricing" className="link link-hover">
                  Pricing
                </TrackingLink>
                <TrackingLink href="/blog" className="link link-hover">
                  Blog
                </TrackingLink>
                <a href="/#" target="_blank" className="link link-hover">
                  Affiliates
                </a>
              </div>
            </div>

            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-black tracking-widest text-sm md:text-left mb-3">
                LEGAL
              </div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <TrackingLink href="/tos" className="link link-hover">
                  Terms of services
                </TrackingLink>
                <TrackingLink href="/privacy-policy" className="link link-hover">
                  Privacy policy
                </TrackingLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
