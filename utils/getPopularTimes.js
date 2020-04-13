const axios = require("axios");

const getPopularTimes = async (address) => {
  const { data } = await axios
    .post(
      `https://api.apify.com/v2/acts/drobnikj~crawler-google-places/runs?token=${process.env.APIFY_API_TOKEN}`,
      {
        searchString: address,
        proxyConfig: { useApifyProxy: true },
        maxCrawledPlaces: 1,
        includeReviews: false,
        includeImages: false,
        includeOpeningHours: false,
        includePeopleAlsoSearch: false,
      }
    )
    .catch((e) => console.log(e));
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(
    `https://api.apify.com/v2/datasets/${data.data.defaultDatasetId}/items`
  );
  const response = await axios
    .get(
      `https://api.apify.com/v2/datasets/${data.data.defaultDatasetId}/items`
    )
    .catch((e) => console.log(e));
  console.log(response.data);
};

// getPopularTimes("place_id:ChIJZZ-jjkjGwoARC1tsoxCA_5Q");
