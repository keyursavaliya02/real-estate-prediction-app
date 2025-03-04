const fs = require('fs'); // Import fs module

// Load your data from JSON file
const rawData = JSON.parse(fs.readFileSync('data.json', 'utf8')); // Use the correct file name and path

// Function to normalize data
const normalizeData = (data, min, max) => {
    if (data < min || data > max) {
      console.warn(`Invalid value ${data} for normalization. Expected between ${min} and ${max}`);
      return NaN; // Return NaN if data is out of range
    }
    return (data - min) / (max - min);
  };

  const encodeLocation = (location) => {
    if (location === "Downtown") return [1, 0, 0];
    if (location === "Suburban") return [0, 1, 0];
    if (location === "Rural") return [0, 0, 1];
    console.warn(`Unknown location: ${location}`); // Warn if the location is unknown
    return [0, 0, 0];  // Default to all zeros if no match
  };

// Define min and max values for normalization (these can be adjusted based on your data)
const areaMin = 10, areaMax = 30000;
const ageMin = 0, ageMax = 50;
const bedroomsMin = 1, bedroomsMax = 5;
const priceMin = 50, priceMax = 15000;

// Preprocess the data
const preprocessData = (rawData) => {
    return rawData.map(item => {
      // Convert string values to numbers
      const area = parseFloat(item['Area (sq ft)']);
      const bedrooms = parseInt(item['Bedrooms'], 10);
      const bathrooms = parseInt(item['Bathrooms'], 10);
      const location = item['Location'];
      const age = parseInt(item['Age of Property (years)'], 10);
      const price = parseFloat(item['Price (in $1000)']);
  
      // Check for missing values in raw data
      if (isNaN(area) || isNaN(bedrooms) || isNaN(bathrooms) || !location || isNaN(age) || isNaN(price)) {
        console.warn('Invalid data found in the item:', item);
        return null; // Skip invalid data
      }
  
      // Normalize the data
      const normalizedArea = normalizeData(area, areaMin, areaMax);
      const normalizedBedrooms = normalizeData(bedrooms, bedroomsMin, bedroomsMax);
      const normalizedBathrooms = normalizeData(bathrooms, 1, 3); // Assuming bathrooms range from 1 to 3
      const encodedLocation = encodeLocation(location);
      const normalizedAge = normalizeData(age, ageMin, ageMax);
      const normalizedPrice = normalizeData(price, priceMin, priceMax);
  
      // Check if any normalized value is NaN (invalid), and skip the item if so
      if ([normalizedArea, normalizedBedrooms, normalizedBathrooms, ...encodedLocation, normalizedAge, normalizedPrice].includes(NaN)) {
        console.warn('Skipping item due to invalid normalized data:', item);
        return null; // Skip invalid data
      }
  
      return {
        input: [
          normalizedArea,
          normalizedBedrooms,
          normalizedBathrooms,
          ...encodedLocation,
          normalizedAge
        ],
        output: [normalizedPrice]  // Normalize price
      };
    }).filter(item => item !== null); // Remove any invalid entries
  };

// Preprocess the data
const preprocessedData = preprocessData(rawData);

// Output the preprocessed data to verify
console.log(preprocessedData);

// Export the preprocessed data (if needed)
module.exports = { preprocessedData };