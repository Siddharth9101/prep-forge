import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import AuthContextProvider from "./features/auth/auth.provider.jsx";
import InterviewContextProvider from "./features/interview/interview.provider.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AuthContextProvider>
        <InterviewContextProvider>
          <RouterProvider router={router} />
        </InterviewContextProvider>
      </AuthContextProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
