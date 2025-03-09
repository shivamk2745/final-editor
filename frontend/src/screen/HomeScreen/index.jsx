import { useContext } from "react";
import "./index.scss";
import RightScreen from "./rightScreen";
import { ModalContext } from "../../Provider/ProviderModal";
import Modals from "../../Provider/Modal/Modals";
import logo from "../assets/logo.png";
const EditorHome = () => {
  const modalFeature = useContext(ModalContext);
  const modalOpen = () => {
    modalFeature.openModal("C");
  };
  return (
    <div className="home-container">
      <div className="left-container">
        <div className="logo-container">
          <img src={ logo} alt="logo" />
          <h1>codeOnline</h1>
          <h2>Code. Compile. Learn</h2>
          <button onClick={modalOpen}>
            <span className="material-icons">add</span>
            <h3>Create New PlayGround</h3>
          </button>
        </div>
      </div>
      <RightScreen />
      <Modals />
    </div>
  );
};
export default EditorHome;
