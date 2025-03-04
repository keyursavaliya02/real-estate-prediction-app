import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PredictionChart = ({ actualPrices, predictedPrices }) => {
  const data = {
    labels: actualPrices.map((_, index) => `Property ${index + 1}`),
    datasets: [
      {
        label: "Actual Prices",
        data: actualPrices,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Predicted Prices",
        data: predictedPrices,
        borderColor: "red",
        fill: false,
      },
    ],
  };

  return (
    <div className="mt-4">
      <h2>Prediction Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default PredictionChart;
