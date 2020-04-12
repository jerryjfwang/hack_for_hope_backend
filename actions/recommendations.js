const {
  getNeighborhoods,
  getNeighborhoodCoordinates,
} = require("../utils/getNeighborhoods");
const getDuration = require("../utils/getDuration");
const filterNeighborhoodsForDuration = require("../utils/filterNeighborhoodsForDuration");

const getRecommendations = async (req, res) => {
  const latitude = 34.04403; // user location
  const longitude = -118.25672; // user location
  const maxDuration = 10; // in minutes
  const daysLeft = 6; // days left until groceries run out
  const travelMethod = "driving"; // driving, walking, bicylcing

  // Get all LA neighborhoods
  const neighborhoods = await getNeighborhoods();
  const neighborhoodCoordinates = await Promise.all(
    neighborhoods.map(({ name }) => getNeighborhoodCoordinates(name))
  );

  // Filter out neighborhoods that will definitely take longer than user's max duration to get to
  const filteredNeighborhoods = filterNeighborhoodsForDuration(
    neighborhoods,
    neighborhoodCoordinates,
    { latitude, longitude },
    maxDuration,
    travelMethod
  );

  // Get all grocery stores in each neighborhood
  const allGroceryStores = require("../neighborhoods.json");
  filteredNeighborhoods.forEach(
    (neighborhood) =>
      (neighborhood.groceryStores = allGroceryStores[neighborhood.name])
  );

  // Get all optimistic durations for those grocery stores and filter out the ones where duration > maxDuration
  const neighborhoodsWithinDuration = [];
  await Promise.all(
    filteredNeighborhoods.map(async ({ name, cases, groceryStores }) => {
      const durations = await Promise.all(
        groceryStores.map(({ location }) =>
          getDuration(
            latitude,
            longitude,
            location.lat,
            location.lng,
            travelMethod
          )
        )
      );
      const filteredGroceryStores = groceryStores.filter(
        (_, i) => durations[i] <= maxDuration
      );
      if (filteredGroceryStores.length)
        neighborhoodsWithinDuration.push({
          name,
          cases,
          groceryStores: filteredGroceryStores,
        });
    })
  );

  // Get the safest neighborhoods
  const safestNeighborhoods = [];

  // If # of cases are tied with the least # of cases, include them. Else, take the top 3 safest neighborhoods.
  let minCases = Infinity;
  neighborhoodsWithinDuration.forEach(
    ({ cases }) => (minCases = Math.min(minCases, cases))
  );
  neighborhoodsWithinDuration
    .sort((a, b) => a.cases - b.cases)
    .every((neighborhood) => {
      if (neighborhood.cases > minCases && safestNeighborhoods.length > 3)
        return false;
      safestNeighborhoods.push(neighborhood);
      return true;
    });

  // Get all the grocery stores from those neighborhoods
  const safestGroceryStores = [];
  safestNeighborhoods.forEach(({ groceryStores }) =>
    safestGroceryStores.push(...groceryStores)
  );

  // Sort the safest grocery stores by their total ratings and filter out any with less than 10 ratings
  const recommendations = safestGroceryStores
    .sort((a, b) => b.totalRatings - a.totalRatings)
    .filter(({ totalRatings }) => totalRatings >= 10);

  // Return the top three grocery stores with the optimal busy times

  res.json({ recommendations });
};

module.exports = getRecommendations;