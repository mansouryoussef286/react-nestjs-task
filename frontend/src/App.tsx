import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import HomePage from "./pages/Home";
import SignupPage from "./pages/Signup";
import SigninPage from "./pages/Signin";
import LandingPage from "./pages/LandingPage";
import { UserServiceProvider } from "./providers/userService.provider";
import { ApiProvider } from "./providers/api.provider";

export default function App() {
  return (
    <UserServiceProvider>
      <ApiProvider>

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

      </ApiProvider>
    </UserServiceProvider>
  );
}
