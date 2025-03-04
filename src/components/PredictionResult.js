import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictionChart from "./PredictionChart.js";

const PredictionResult = () => {
  const navigate = useNavigate();
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [actualPrices, setActualPrices] = useState([]);
  const [predictedPrices, setPredictedPrices] = useState([]);

  useEffect(() => {
    const storedPredictedPrice = localStorage.getItem("predictedPrice");
    const storedActualPrices = JSON.parse(localStorage.getItem("actualPrices")) || [];
    const storedPredictedPrices = JSON.parse(localStorage.getItem("predictedPrices")) || [];

    if (!storedPredictedPrice) {
      navigate("/");
    } else {
      setPredictedPrice(storedPredictedPrice);
      setActualPrices(storedActualPrices);
      setPredictedPrices(storedPredictedPrices);
    }
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h2>Prediction Result</h2>
      {predictedPrice && <h3 className="text-success">Predicted Price: ${predictedPrice}</h3>}
      {actualPrices.length > 0 && predictedPrices.length > 0 && (
        <PredictionChart actualPrices={actualPrices} predictedPrices={predictedPrices} />
      )}
      <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

export default PredictionResult;
