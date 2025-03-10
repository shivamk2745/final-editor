import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer p-10 bg-[#1d1d1d] text-gray-200 p-10 pt-16">
        <nav className="flex flex-col pl-64">
          <h6 className="footer-title text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">Services</h6>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Branding</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Design</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Marketing</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Advertisement</a>
        </nav>
        <nav className="flex flex-col">
          <h6 className="footer-title text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">Company</h6>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">About us</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Contact</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Jobs</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Press kit</a>
        </nav>
        <nav className="flex flex-col">
          <h6 className="footer-title text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">Legal</h6>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Terms of use</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Privacy policy</a>
          <a className="link link-hover text-xl mb-2 hover:text-violet-400 transition-colors duration-200">Cookie policy</a>
        </nav>
        <form>
          <h6 className="footer-title text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">Newsletter</h6>
          <fieldset className="form-control w-80">
            <label className="label">
              <span className="label-text text-xl text-gray-300">Enter your email address</span>
            </label>
            <div className="join mt-2">
              <input
                type="text"
                placeholder="username@site.com"
                className="input input-bordered join-item text-xl w-full p-3 bg-neutral-800 border-neutral-700 text-white"
              />
              <button className="btn join-item bg-gradient-to-r from-cyan-300 to-violet-500 border-none text-neutral-900 hover:text-white transition-colors duration-300 text-2xl">Subscribe</button>
            </div>
          </fieldset>
        </form>
      </footer>
      <footer className="footer footer-center p-4 bg-[#1d1d1d] text-gray-400 border-t border-neutral-800">
        <aside>
          <p className="text-lg">© 2025 CodeEDU - All rights reserved</p>
        </aside>
      </footer>
    </>
  );
}

export default Footer;
