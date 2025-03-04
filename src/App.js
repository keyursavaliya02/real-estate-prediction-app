import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import RealEstatePricePrediction from "./components/RealEstatePricePrediction.js";
import PredictionResult from "./components/PredictionResult.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RealEstatePricePrediction />} />
        <Route path="/result" element={<PredictionResult />} />
      </Routes>
    </Router>
  );
}

export default App;