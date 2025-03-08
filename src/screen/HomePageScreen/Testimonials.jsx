import React, { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from "./Card";
import testimonials from "../store/testimonials.json";

function Testimonials() {
  // Enhance the slider with custom arrow styles
  const NextArrow = ({ onClick }) => (
    <div 
      className="absolute right-0 top-1/2 -mt-6 z-10 cursor-pointer bg-gradient-to-r from-cyan-300 to-violet-500 p-3 rounded-full shadow-lg"
      onClick={onClick}
      style={{ transform: "translateY(-50%)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div 
      className="absolute left-0 top-1/2 -mt-6 z-10 cursor-pointer bg-gradient-to-r from-violet-500 to-cyan-300 p-3 rounded-full shadow-lg"
      onClick={onClick}
      style={{ transform: "translateY(-50%)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </div>
  );

  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-out",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: true,
    appendDots: dots => (
      <div>
        <ul className="flex justify-center gap-2 mt-8"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-300 to-violet-500 opacity-50 hover:opacity-100 transition-opacity"></div>
    ),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    // Add a clean-up function to prevent memory leaks
    return () => {
      // Any cleanup if needed when component unmounts
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#1d1d1d] to-[#041c31] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h1 className="text-6xl md:text-7xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500 mb-6">
            Testimonials
          </h1>
          <p className="text-center text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Here are some of the people who have been using our tool and sharing their experiences.
          </p>
          <div className="absolute w-48 h-48 bg-violet-500 rounded-full opacity-10 -top-10 -left-10 blur-3xl"></div>
          <div className="absolute w-48 h-48 bg-cyan-500 rounded-full opacity-10 -bottom-10 -right-10 blur-3xl"></div>
        </div>
        
        <div className="relative overflow-hidden px-8 md:px-12">
          <Slider {...settings} className="py-10">
            {testimonials.map((item) => (
              <div key={item.id} className="px-3 py-6">
                <Card item={item} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
