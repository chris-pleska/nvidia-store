import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HelpMeChoose from "./pages/HelpMeChoose.jsx";
import Home from "./pages/Home.jsx";
import ModelAdvisor from "./pages/ModelAdvisor.jsx";
import Requests from "./pages/Requests.jsx";
import Shop from "./pages/Shop.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/help-me-choose" element={<HelpMeChoose />} />
        <Route path="/model-advisor" element={<ModelAdvisor />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </div>
  );
}
