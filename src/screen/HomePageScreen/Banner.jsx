import React from "react";
import { Link } from "react-router-dom";
import dotted from "../assets/dotted.png";
import HomeCode from "../assets/homeCode.png";
function Banner() {
  return (
    <>
      <div className="hero bg-gradient-to-b from-[#1d1d1d] via-[#1d1d1d] to-[#041c31] min-h-screen flex flex-col md:flex-row">
        <div className="hero-content w-full md:w-1/2 order-1">
          <div className="max-w-2xl mx-auto p-10">
            <h1 className="text-6xl font-bold text-left text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">A tool to help in your code journey</h1>
            <p className="py-8 text-white text-3xl">
              Elevate your coding skills with our interactive platform. Practice problems, track your progress, and prepare for technical interviews with ease.
            </p>
            <div className="relative inline-block">
              <div className="absolute bg-violet-700 blur-xl rounded-sm h-12 w-28 bottom-0"></div>
              <Link to="/editorpage" className="relative px-6 py-4 font-medium rounded-lg bg-transparent bg-clip-border bg-gradient-to-r from-cyan-300 to-violet-500 hover:text-white transition-colors duration-300 text-black text-2xl">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-content w-full md:w-1/2 order-2 relative mt-28 md:mt-0">
          <div className="absolute opacity-11">
            <img src={ dotted} alt="" style={{width: "100%", height: "450px"}}/>
          </div>
          <div className="bg-transparent bg-clip-border bg-gradient-to-br from-cyan-300 to-violet-500 h-96 md:h-[38rem] w-screen rounded-3xl relative animate-[bounce_4s_ease-in-out_infinite]">
            <img src={ HomeCode} alt="" className="w-fit h-fit md:w-full md:h-full"></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
