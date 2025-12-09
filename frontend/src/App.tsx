
import { UserServiceProvider } from "./context/userService.provider";
import "./App.scss";
import AppWrapper from "./pages/InternalPages/AppWrapper";

export default function App() {
  return (
    <div className="app">
      <UserServiceProvider>
        <AppWrapper />
      </UserServiceProvider>
    </div>
  );
}
