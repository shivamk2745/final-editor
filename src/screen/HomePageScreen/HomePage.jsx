import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Logout from "./Logout";
// import Login from "./Login";
import Navbar from "./Navbar";
import Banner from "./Banner";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

const HomePage = () => {
  const [authUser, setAuthUser] = useState(true);
 return (
    <>
      <Navbar></Navbar>
      <Banner></Banner>
      <Testimonials></Testimonials>
      <Footer></Footer>
    </>
  )
};
export default HomePage;
