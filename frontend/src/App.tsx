import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import LandingPage from "./pages/LandingPage";
import { UserServiceProvider } from "./context/userService.provider";

export default function App() {
  return (
    <UserServiceProvider>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>

    </UserServiceProvider>
  );
}
