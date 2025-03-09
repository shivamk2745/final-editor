import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Features from "../components/Features";

const HomePage = () => {
  const [authUser, setAuthUser] = useState(true);
  return (
    <>
      <Navbar></Navbar>
      <Banner></Banner>
      <Features></Features>
      <Testimonials></Testimonials>
      <Footer></Footer>
    </>
  );
};
export default HomePage;
