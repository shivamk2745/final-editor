import { useContext } from "react";
import { ModalContext } from "../ProviderModal";
import CreatePlaygroundModal from "./CreatePlaygroundModal";
import NewFolder from "./NewFolder";
import NewPlayground from "./NewPlayground";
import DeletePopup from "./DeletePopup";
import EditFolder from "./EditFolder";
const Modals = () => {
  const { activeModal, modalProps } = useContext(ModalContext);
  // console.log(modalFeature.activeModal);
  return (
    <>
      {(activeModal === "C" && <CreatePlaygroundModal {...modalProps} />) ||
        (activeModal === "New_folder" && <NewFolder {...modalProps} />) ||
        (activeModal === "New-playground" && (
          <NewPlayground {...modalProps} />
        )) ||
        (activeModal === "delete-folder" && <DeletePopup {...modalProps} />) ||
        (activeModal === "edit-folder" && <EditFolder {...modalProps} />)}
    </>
  );
};
export default Modals;
