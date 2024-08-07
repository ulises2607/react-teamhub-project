import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import AuthenticationPage from "./components/pages/Authentication/AuthenticationPage";
import ServerList from "./components/pages/ServerList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<AuthenticationPage />} />
        <Route path="servers" element={<ServerList />} />
      </Routes>
    </Router>
  );
}

export default App;
