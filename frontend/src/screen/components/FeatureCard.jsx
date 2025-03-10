import React from "react";
import compiler from "../assets/compiler.svg";
import collab from "../assets/collab.svg";
import code from "../assets/code.svg";

function FeatureCard({ item }) {
  const isEven = item.id % 2 === 0;

  return (
    <>
      <div
        className={`card bg-[#102b43] text-primary-content m-6 transition-transform duration-300 hover:scale-105`}
      >
        <div
          className={`card-body flex flex-col lg:flex-row ${isEven ? "lg:flex-row" : ""} items-center justify-between`}
        >
          
          {item.id === 1 && (
            <div className="bg-primary w-full lg:w-1/3 h-40 flex justify-center items-center rounded-3xl m-5 lg:mb-0">
              <img
                src={collab}
                alt={item.title}
                className="h-full object-contain"
              />
            </div>
          )}
          {item.id === 2 && (
            <div className="bg-amber-500 w-full lg:w-1/3 h-40 flex justify-center items-center rounded-3xl m-5 lg:mb-0">
              <img
                src={compiler}
                alt={item.title}
                className="h-full object-contain"
              />
            </div>
          )}
          {item.id === 3 && (
            <div className="bg-teal-600 w-full lg:w-1/3 h-40 flex justify-center items-center rounded-3xl m-5 lg:mb-0">
              <img
                src={code}
                alt={item.title}
                className="h-full object-contain"
              />
            </div>
          )}

        
          <div className={`text-section lg:w-2/3`}>
            <h2 className="card-title text-3xl font-bold text-center lg:text-left text-white m-5">
              {item.title}
            </h2>
            <p className="text-xl text-gray-300 m-5 lg:text-left">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeatureCard;
