import { Routes, Route } from "react-router-dom";
import "../../App.scss";
import { useContext } from "react";
import { UserServiceContext } from "../../context/userService.provider";
import ResponsiveAppBar from "./header";
import LandingPage from "../ExternalPages/LandingPage";
import SignupPage from "../ExternalPages/SignupPage";
import SigninPage from "../ExternalPages/SigninPage";
import ProtectedRoute from "../../router/ProtectedRoute";
import HomePage from "./HomePage";
export default function AppWrapper() {
  //use the user provider to render header if user is logged in
  const { user } = useContext(UserServiceContext)!;
  return (
    <>
      {user && <ResponsiveAppBar />}
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
    </>


  );
}
