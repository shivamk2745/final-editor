import { BrowserRouter, Route, Routes } from "react-router-dom";
import Playground from "./screen/PlayGroundScreen";
import EditorHome from "./screen/HomeScreen";
import PlaygroundProvider from "./Provider/PlaygroundProvider";
import ProviderModal from "./Provider/ProviderModal";
import HomePage from "./screen/HomePageScreen/HomePage";
import Signup from "./screen/components/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./Provider/AuthProvider";
import CreateProfile from "./screen/components/CreateProfile";
import Profile from "./screen/HomePageScreen/Profile";
import InterviewLandingPage from "./screen/Interview/InterviewLandingPage";
import InterviewPage from "./screen/Interview/InterviewPage";
function App() {
  const [authUser, setAuthUser] = useAuth();

  return (
    <PlaygroundProvider>
      <ProviderModal>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup></Signup>} />
            <Route path="/editorpage" element={authUser ? <EditorHome /> : <HomePage />} />
            <Route path="/interview" element={authUser ? <InterviewLandingPage/> : <HomePage/>} />
            <Route
              path="/profile"
              element={authUser ? <CreateProfile /> : <Signup />}
            />
            <Route
              path="/showProfile"
              element={authUser ? <Profile /> : <HomePage />}
            />
            <Route
              path="/editorpage/playground/:fileId/:folderId/:fileName"
              element={<Playground />}
            />
            <Route path="/interview/:interviewId" element={ authUser ? <InterviewPage/> : <HomePage/>} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ProviderModal>
    </PlaygroundProvider>
  );
}

export default App;
