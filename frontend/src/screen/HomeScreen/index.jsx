import { useContext } from "react";
import RightScreen from "./rightScreen";
import { ModalContext } from "../../Provider/ProviderModal";
import Modals from "../../Provider/Modal/Modals";
import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";

const EditorHome = () => {
  const modalFeature = useContext(ModalContext);
  const modalOpen = () => {
    modalFeature.openModal("C");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1d1d1d] via-[#1d1d1d] to-[#041c31] overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-10 flex flex-col items-center justify-center w-full max-w-md border border-white border-opacity-20 shadow-xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-violet-500 blur-md transform scale-110"></div>
              <img 
                src={logo} 
                alt="logo" 
                className="relative w-32 h-32 object-contain"
              />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">codeOnline</h1>
            <h2 className="text-xl text-white text-opacity-80 mb-8">Code. Compile. Learn</h2>
            
            <button 
              onClick={modalOpen}
              className="group w-full bg-gradient-to-r from-cyan-400 to-violet-600 hover:from-cyan-500 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50 flex items-center justify-center"
            >
              <span className="material-icons mr-2 group-hover:rotate-90 transition-transform duration-300">add</span>
              <span className="text-lg">Create New PlayGround</span>
            </button>
            
            <div className="mt-10 w-full bg-white bg-opacity-10 rounded-xl p-4">
              <h3 className="text-white text-opacity-90 font-medium mb-2">Quick Start</h3>
              <ul className="space-y-2 text-white text-opacity-70">
                <li className="flex items-center">
                  <span className="material-icons text-sm mr-2">check_circle</span>
                  <span>Create a new playground</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-sm mr-2">check_circle</span>
                  <span>Choose your language</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-sm mr-2">check_circle</span>
                  <span>Start coding right away</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        
        <div className="md:w-1/2 overflow-hidden">
          <RightScreen />
        </div>
      </div>
      
      <Modals />
    </div>
  );
};

export default EditorHome;
