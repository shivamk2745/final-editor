import React from "react";
import FeatureCard from "./FeatureCard";
import features from "../store/features.json";

function Features() {
  return (
    <>
      <div className="p-10 bg-gradient-to-b from-[#041c31] to-[#0b0b0b] ">
        {features.map((item) => (
          <FeatureCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}

export default Features;
