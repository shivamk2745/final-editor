import { useContext } from "react";
import "./modal.scss";
import { ModalContext } from "../ProviderModal";
import { PlaygroundContext } from "../PlaygroundProvider";
const CreatePlaygroundModal = () => {
  const playGroundFeature = useContext(PlaygroundContext);
  const modalFeature = useContext(ModalContext);

  const formSubmit = (e) => {
    e.preventDefault();
    const folderName = e.target.folderName.value;
    const fileName = e.target.fileName.value;
    const language = e.target.language.value;
    playGroundFeature.createPlayground({
      folderName,
      fileName,
      language,
    });
    closePlayground();
  };

  const closePlayground = () => {
    modalFeature.closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={formSubmit}>
        <span className="material-icons close" onClick={closePlayground}>
          close
        </span>
        <div className="item">
          <h1>Create New Playground & Create New Folder</h1>
        </div>
        <div className="item">
          <h3>Enter Folder Name</h3>
          <input type="text" name="folderName" required autofocus />
        </div>
        <div className="item">
          <h3>Enter File Name</h3>
          <input type="text" name="fileName" required autofocus />
        </div>
        <div className="item">
          <select name="language" required>
            <option value="cpp">cpp</option>
            <option value="javascript">javascript</option>
            <option value="java">java</option>
            <option value="python">python</option>
          </select>
          <button type="submit">Create Playground</button>
        </div>
      </form>
    </div>
  );
};
export default CreatePlaygroundModal;
