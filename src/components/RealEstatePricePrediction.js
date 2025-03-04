import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import brain from "brain.js";
import PredictionChart from "./PredictionChart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";

const RealEstatePricePrediction = () => {
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [model, setModel] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState("");
  const [actualPrices, setActualPrices] = useState([]);
  const [predictedPrices, setPredictedPrices] = useState([]);
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const locationMapping = { "Downtown": 0, "Rural": 1, "Suburban": 2 };

  const backgroundImages = {
    "Downtown": "/images/downtown.jpg",
    "Rural": "/images/rural.jpg",
    "Suburban": "/images/suburban.jpg"
  };

  useEffect(() => {
    if (currentLocation.pathname === "/") {
      document.body.style.backgroundImage = `url(${backgroundImages[location] || "none"})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.transition = "background 0.5s ease-in-out";
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [location, currentLocation.pathname]);

  useEffect(() => {
    const data = [
      { area: 1360, bedrooms: 2, bathrooms: 1, location: "Downtown", age: 1, price: 764 },
      { area: 4272, bedrooms: 2, bathrooms: 3, location: "Rural", age: 47, price: 673 },
      { area: 3592, bedrooms: 4, bathrooms: 2, location: "Downtown", age: 34, price: 1051 },
      { area: 966, bedrooms: 5, bathrooms: 1, location: "Rural", age: 32, price: 462 },
      { area: 4926, bedrooms: 3, bathrooms: 3, location: "Suburban", age: 48, price: 936 }
    ];

    const maxValues = { area: 5000, bedrooms: 5, bathrooms: 3, age: 50, price: 1500 };
    const trainingData = data.map(entry => ({
      input: {
        area: entry.area / maxValues.area,
        bedrooms: entry.bedrooms / maxValues.bedrooms,
        bathrooms: entry.bathrooms / maxValues.bathrooms,
        location: locationMapping[entry.location],
        age: entry.age / maxValues.age
      },
      output: { price: entry.price / maxValues.price }
    }));

    setActualPrices(data.map(entry => entry.price));

    const net = new brain.NeuralNetwork();
    net.train(trainingData);
    setModel(net);
  }, []);

  const handlePredict = () => {
    if (!model) return;

    if (area <= 0 || bedrooms <= 0 || bathrooms <= 0 || age < 0 || !(location in locationMapping)) {
      setError("Invalid input values. Ensure all values are positive and location is valid.");
      return;
    }
    setError("");

    const maxValues = { area: 5000, bedrooms: 5, bathrooms: 3, age: 50, price: 1500 };
    const input = {
      area: Number(area) / maxValues.area,
      bedrooms: Number(bedrooms) / maxValues.bedrooms,
      bathrooms: Number(bathrooms) / maxValues.bathrooms,
      location: locationMapping[location],
      age: Number(age) / maxValues.age
    };

    const output = model.run(input);
    const predictedPriceValue = output.price * maxValues.price;

    setPredictedPrice(predictedPriceValue.toFixed(2));
    setPredictedPrices(prev => [...prev, predictedPriceValue]);

    // Store values in localStorage to use on result page
    localStorage.setItem("predictedPrice", predictedPriceValue.toFixed(2));
    localStorage.setItem("actualPrices", JSON.stringify(actualPrices));
    localStorage.setItem("predictedPrices", JSON.stringify([...predictedPrices, predictedPriceValue]));

    // Navigate to result page
    navigate("/result");
  };

  return (
    <div className="form-container animated-bg pulse-animation">
      <h2 className="form-title fade-in">Real Estate Price Prediction</h2>
      {error && <p className="error-message bounce-in">{error}</p>}
      <div className="input-group slide-in">
        <label>Area (sq ft):</label>
        <input type="number" value={area} onChange={(e) => setArea(e.target.value)} min="1" />
      </div>
      <div className="input-group slide-in">
        <label>Number of Bedrooms:</label>
        <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} min="1" />
      </div>
      <div className="input-group slide-in">
        <label>Number of Bathrooms:</label>
        <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} min="1" />
      </div>
      <div className="input-group slide-in">
        <label>Location:</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          <option value="Downtown">Downtown</option>
          <option value="Rural">Rural</option>
          <option value="Suburban">Suburban</option>
        </select>
      </div>
      <div className="input-group slide-in">
        <label>Age of Property (years):</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="0" />
      </div>
      <button className="predict-button wobble-animation" onClick={handlePredict}>Predict Price</button>
      {predictedPrice && <h3 className="predicted-price glow-text">Predicted Price: ${predictedPrice}</h3>}
      {predictedPrices.length > 0 && <PredictionChart actualPrices={actualPrices} predictedPrices={predictedPrices} />} 
    </div>
  );
};

export default RealEstatePricePrediction;