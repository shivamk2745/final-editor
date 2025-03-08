import React from "react";
import defaultUser from "../assets/defaultUser.jpg";

function Card({ item }) {
  return (
    <div 
      className={`relative p-6 sm:p-8 md:p-10 w-full sm:w-80 md:w-80 lg:w-96 shadow-lg 
        transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl 
        rounded-3xl text-white mx-auto ${item.bgColor || "bg-red-500"}
        border border-opacity-10 border-white backdrop-blur-sm`}
    >
      <div className="flex justify-center -mt-12">
        <div className="avatar">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 
            rounded-full border-4 border-white shadow-md
            transition-transform duration-300 hover:scale-105">
            <img 
              src={defaultUser} 
              alt="User" 
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <div className="pt-4 mt-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">{item.name}</h2>
        <p className="text-white/80 mb-4 text-center text-sm sm:text-base leading-relaxed">{item.text}</p>
        <div className="flex justify-center mt-2">
          <div className="rating rating-md">
            {[...Array(5)].map((_, i) => (
              <input 
                key={i} 
                type="radio" 
                name={`rating-${item.id}`} 
                className="mask mask-star-2 bg-yellow-400" 
                checked={i < item.rating} 
                readOnly
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;