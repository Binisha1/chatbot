import { BrowserRouter, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import SignIn from "./pages/signIn";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/SignIn" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
