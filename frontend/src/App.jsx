import { Route, Routes } from "react-router-dom";
import HelpWidget from "./components/HelpWidget.jsx";
import Navbar from "./components/Navbar.jsx";
import Compare from "./pages/Compare.jsx";
import HelpMeChoose from "./pages/HelpMeChoose.jsx";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import ModelAdvisor from "./pages/ModelAdvisor.jsx";
import Requests from "./pages/Requests.jsx";
import RequestQuote from "./pages/RequestQuote.jsx";
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
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
      <HelpWidget />
    </div>
  );
}
