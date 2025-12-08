'use client'
import React from "react";
import contactImage from "../images/contact.png"; // Make sure to have an appropriate image in the public folder

export default function ContactPage() {
  return (
    <div className="min-h-[80vh] flex flex-col  md:flex-row ">
      {/* Left Side with Background Image */}
        <div className="md:w-1/2 w-full h-44 md:h-auto bg-cover bg-center lg:m-3 border-cyan-300 border rounded shadow-amber-300"
        style={{
          backgroundImage: `url(${contactImage.src})`, // replace with your photo
        }}
      >
        {/* Optional overlay for aggressive vibe
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-red-600 tracking-widest">
            Join the Battle
          </h2>
        </div> */}
      </div>

      {/* Right Side with Contact Form */}
      <div className="md:w-1/2 w-full bg-black text-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-red-600 mb-8">
            Contact Us
          </h1>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-md bg-black border border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-md bg-black border border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-md bg-black border border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-md shadow-lg transition duration-300"
            >
              Send Message
            </button>
          </form>

          <p className="mt-6 text-gray-400 text-sm">
            Or email us directly at{" "}
            <span className="text-red-500 font-bold">support@tournament.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

