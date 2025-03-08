import { useContext } from "react";
import "./modal.scss";
import { PlaygroundContext } from "../PlaygroundProvider";
import { ModalContext } from "../ProviderModal";
const NewFolder = () => {
  const modalFeature = useContext(ModalContext);
  const { createFolder } = useContext(PlaygroundContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const folderName = e.target.folderName.value;
    createFolder(folderName);
    modalFeature.closeModal();
  };
  const closeSpan = () => {
    modalFeature.closeModal();
  };
  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={handleSubmit}>
        <div className="item">
          <h1 className="new-folder">Create New Folder</h1>
        </div>
        <div className="item">
          <h3>Enter Folder Name</h3>
          <input type="text" name="folderName" required autofocus />
        </div>
        <div className="item">
          <button type="submit" className="cancel" onClick={closeSpan}>
            Cancel
          </button>
          <button type="submit">Create Folder</button>
        </div>
      </form>
    </div>
  );
};
export default NewFolder;
