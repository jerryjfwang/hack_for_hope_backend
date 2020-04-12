/* Import environment variables */
require("dotenv").config(); // Configures the .env file

/* Import package dependencies */
const express = require("express"); // Framework for creating API routes
const cors = require("cors"); // Package to handle cross-origin client requests
const mongoose = require("mongoose"); // ORM to interface MongoDB
const morgan = require("morgan"); // Package for logging incoming client API requests
const bodyParser = require("body-parser"); // Package to allow Express to parse request body

const getNeighborhoods = require("./utils/getNeighborhoods");

/* Create server instance */
const server = express();

/* Connect to the database */
// mongoose.connect(encodeURI(process.env.MONGODB_URI), {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });
// mongoose.connection.on("connected", () => {
//   console.log("MongoDB connected!");
// });

/* Initialize middleware */
server.use(cors()); // Allows cross-origin access to the server
server.use(morgan("dev")); // Logs to the console incoming client API requests
server.use(bodyParser.json()); // Allows Express to parse request body

/* Set up appropriate routers */
server.get("/", (req, res) => res.send("Hello world!"));
server.get("/recommendation", async (req, res) => {
  const latitude = 34.04403; // user location
  const longitude = -118.25672; // user location
  const maxDuration = 25; // in minutes
  const daysLeft = 6; // days left until groceries run out
  const travelMethod = "driving"; // driving, walking, bicylcing

  // Get all LA neighborhoods
  const neighborhoods = await getNeighborhoods();

  // Get all grocery stores in each neighborhood
  const allGroceryStores = require("./neighborhoods.json");
  neighborhoods.forEach(
    (neighborhood) =>
      (neighborhood.groceryStores = allGroceryStores[neighborhood.name])
  );

  // Get all minimum durations to those grocery stores

  // Filter out grocery stores that will take longer than user's maxDuration to get to

  // Sort neighborhoods by asc # of cases

  // Sort all the grocery stores in the top three neighborhoods by ratio of rating per # of ratings

  // Return the top three three grocery stores with the optimal busy times

  res.json({ neighborhoods });
});

/* Initalize server instance to listen for requests on specified port */
server.listen(process.env.SERVER_PORT || 8080, () =>
  console.log(
    `Server ready. Listening at port ${process.env.SERVER_PORT || 8080}`
  )
);
