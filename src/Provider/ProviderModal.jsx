import { createContext, useState } from "react";

export const ModalContext = createContext();

const ProviderModal = ({ children }) => {
  const [modal, setModal] = useState({ type: null, props: {} });

  const closeModal = () => {
    setModal({ type: null, props: {} });
  };
  const openModal = (type, props = {}) => {
    setModal({ type, props });
  };
  // console.log(modal);
  const modalFeature = {
    openModal,
    closeModal,
    activeModal: modal.type,
    modalProps: modal.props,
  };

  return (
    <ModalContext.Provider value={modalFeature}>
      {children}
    </ModalContext.Provider>
  );
};
export default ProviderModal;
