import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import PublicRoute from "./components/PublicRoute";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/",
            element: <AuthForm isRegister={false} />,
          },
          {
            path: "/register",
            element: <AuthForm isRegister={true} />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/todos",
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
