import { useContext, useEffect, useState } from "react";
import "./modal.scss";
import { PlaygroundContext } from "../PlaygroundProvider";
import { ModalContext } from "../ProviderModal";
const DeletePopup = ({ id }) => {
  const modalFeature = useContext(ModalContext);
  const { createFolder, deleteFolder, folders, deleteCard } =
    useContext(PlaygroundContext);
  const closeSpan = () => {
    modalFeature.closeModal();
  };
  const [title, setTitle] = useState();
  useEffect(() => {
    folders.map((folder) => {
      if (folder.id === id) {
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
  const handleDelete = () => {
    folders.map((folder) => {
      if (folder.id === id) {
        deleteFolder(id);
      } else
        folder.files.map((file) => {
          if (file.id === id) {
            deleteCard(id);
          }
        });
    });
    modalFeature.closeModal();
  };
  return (
    <div className="modal-container">
      <div className="modal-body">
        <div className="item">
          <h1 className="new-folder">
            Are, you sure you want to delete {title}??{" "}
          </h1>
        </div>

        <div className="item">
          <button type="submit" className="cancel" onClick={closeSpan}>
            Cancel
          </button>
          <button type="submit" onClick={handleDelete}>
            Delete {title}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeletePopup;
