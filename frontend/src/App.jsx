import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import AuthContextProvider from "./features/auth/auth.provider.jsx";
import InterviewContextProvider from "./features/interview/interview.provider.jsx";

function App() {
  return (
    <>
      <AuthContextProvider>
        <InterviewContextProvider>
          <RouterProvider router={router} />
        </InterviewContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
