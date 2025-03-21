import { BrowserRouter, Route, Routes } from "react-router";
import SignIn from "./pages/signIn";
import ChatPage from "./pages/chatPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "./pages/register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/chatPage" element={<ChatPage />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
