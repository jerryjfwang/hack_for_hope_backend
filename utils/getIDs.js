const axios = require("axios");
const neighborhoods = require("./neighborhoods.json");
const writeJsonFile = require("write-json-file");

console.log("Starting scraping for PlaceIDs");
//console.log(Object.entries(neighborhoods)[0]);
const getPlaceIDs = async (neighborhoods) => {
  // Get an array of all the grocery stores' place ids
  const allGroceryStores = [];

  //For loop to insert all 
  //Unsure of syntax for const [_, value]
  for  (const [_, value] of Object.entries(neighborhoods)) {
    console.log("done");
    let cityStores = Object.entries(neighborhoods)[i];
    allGroceryStores.push(cityStores);
    writeJsonFile("stores.json", allGroceryStores);
    //console.log(Object.entries(neighborhoods)[i]);
  }
  console.log("Done");
  /*
  //For every place id in grocery stores, push into array allGroceryStores the value
  for (const [place_id, value] of Object.entries(neighborhoods)) {
    allGroceryStores.push(...value.map(({ place_id }) => place_id));
    writeJsonFile("placeIDs.json", allGroceryStores);
  }
  */
};
getPlaceIDs();
/*
  // Get the busy time of each placeId and store it in a dictionary
  const allGroceryStoresBusyTimes = {};
  //Counter variable
  let i = 0;
  for (const placeId of allGroceryStores) {
    console.log(
      `Starting grocery store ${i + 1} of ${allGroceryStores.length}`
    );
    const busyTimes = await getBusyTimes(placeId);
    allGroceryStoresBusyTimes[placeId] = busyTimes;
    ++i;
  }
*/
