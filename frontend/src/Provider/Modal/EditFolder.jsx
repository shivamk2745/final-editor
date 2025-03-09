import { useContext, useEffect, useState } from "react";
import "./modal.scss";
import { PlaygroundContext } from "../PlaygroundProvider";
import { ModalContext } from "../ProviderModal";
const EditFolder = ({ id }) => {
  const modalFeature = useContext(ModalContext);
  const [title, setTitle] = useState();
  const { editFolder, editFile, folders } = useContext(PlaygroundContext);
  useEffect(() => {
    folders.map((folder) => {
      if (folder.id == id) {
        setTitle("Folder");
      } else {
        folder.files.map((file) => {
          if (file.id === id) {
            setTitle("File");
          }
        });
      }
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const folderName = e.target.folderName.value;
    folders.map((folder) => {
      if (folder.id == id) {
        editFolder(folderName, id);
      } else {
        folder.files.map((file) => {
          if (file.id === id) {
            editFile(folderName, id);
          }
        });
      }
    });

    modalFeature.closeModal();
  };
  const closeSpan = () => {
    modalFeature.closeModal();
  };
  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={handleSubmit}>
        <div className="item">
          <h1 className="new-folder">Edit {title} Name</h1>
        </div>
        <div className="item">
          <h3>Enter New {title} Name</h3>
          <input type="text" name="folderName" required />
        </div>
        <div className="item">
          <button type="submit" className="cancel" onClick={closeSpan}>
            Cancel
          </button>
          <button type="submit">Edit {title}</button>
        </div>
      </form>
    </div>
  );
};
export default EditFolder;
