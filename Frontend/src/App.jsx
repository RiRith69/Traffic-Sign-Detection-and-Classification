import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar"
import Home from "./pages/Home";
import DetectionCenter from "./pages/DetectionCenter";
import Features from "./pages/Features";
import SignInfo from "./pages/SignInfo";
import "./App.css"
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detectionCenter" element={<DetectionCenter />} />
        <Route path="/features" element={<Features />} />
        <Route path="/signinfo" element={<SignInfo />} />
      </Routes>
    </>
  );
}

export default App;
