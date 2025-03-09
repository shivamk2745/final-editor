import React, { useState } from "react";
import Navbar from "./Navbar";
import Banner from "./Banner";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import Features from "./Features";

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
  )
};
export default HomePage;
