/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import Link from "next/link";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-4xl text-blueGray-600">
                BUS-TECH
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                An Automated Bus Scheduling System is a Free and Open Source
                solution that optimizes the process of scheduling and managing
                bus services. It seamlessly integrates with existing
                transportation systems without altering standard protocols. It
                features robust scheduling algorithms, real-time tracking
                capabilities, and dynamic components for platforms like web and
                mobile applications, ensuring scalability and adaptability for
                diverse use cases.
              </p>
              <div className="mt-12">
                <Link
                  href=""
                  target="_blank"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-400 active:bg-blueGray-500 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px"
          src="/img/pattern_nextjs.png"
          alt="..."
        />
      </section>

      <Footer />
    </>
  );
}
