import { BrowserRouter, Route, Routes } from "react-router-dom";
import Playground from "./screen/PlayGroundScreen";
import EditorHome from "./screen/HomeScreen";
import PlaygroundProvider from "./Provider/PlaygroundProvider";
import ProviderModal from "./Provider/ProviderModal";
import HomePage from "./screen/HomePageScreen/HomePage";

function App() {
  return (
    <PlaygroundProvider>
      <ProviderModal>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editorpage" element={<EditorHome />} />
            <Route
              path="/editorpage/playground/:fileId/:folderId/:fileName"
              element={<Playground />}
            />
          </Routes>
        </BrowserRouter>
      </ProviderModal>
    </PlaygroundProvider>
  );
}

export default App;
