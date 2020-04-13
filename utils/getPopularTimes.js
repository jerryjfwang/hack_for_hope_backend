const axios = require("axios");
const neighborhoods = require("../neighborhoods.json");
const writeJsonFile = require("write-json-file");

const getBusyTimes = async (placeId) => {
  // Start a scraping job in APIFY
  console.log("Starting scraping job");

  const { data } = await axios
    .post(
      `https://api.apify.com/v2/acts/drobnikj~crawler-google-places/runs?token=${
        process.env.APIFY_API_TOKEN || ""
      }`,
      {
        searchString: `place_id:${placeId}`,
        proxyConfig: { useApifyProxy: true },
        maxCrawledPlaces: 1,
        includeReviews: false,
        includeImages: false,
        includeOpeningHours: false,
        includePeopleAlsoSearch: false,
      }
    )
    .catch((e) => console.log(e));

  // Wait for scraping job to finish
  console.log("Waiting for scraping job to finish");
  await new Promise((resolve) => setTimeout(resolve, 20000));

  // Get results from scraping job
  console.log("Getting results of scraping job");
  const response = await axios
    .get(
      `https://api.apify.com/v2/datasets/${data.data.defaultDatasetId}/items`
    )
    .catch((e) => console.log(e));

  // Sleep to prevent APIFY over usage
  console.log("Sleeping for 10 sec to prevent APIFY over usage");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("Finished scraping job");
  return response.data[0] ? response.data[0].popularTimesHistogram : [];
};

const getPopularTimes = async (neighborhoods) => {
  // Get an array of all the grocery stores' place ids
  const allGroceryStores = [];
  for (const [_, value] of Object.entries(neighborhoods)) {
    allGroceryStores.push(...value.map(({ place_id }) => place_id));
  }

  // Get the busy time of each placeId and store it in a dictionary
  const allGroceryStoresBusyTimes = {};
  let i = 0;
  for (const placeId of allGroceryStores) {
    console.log(
      `Starting grocery store ${i + 1} of ${allGroceryStores.length}`
    );
    const busyTimes = await getBusyTimes(placeId);
    allGroceryStoresBusyTimes[placeId] = busyTimes;
    ++i;
  }

  writeJsonFile("busyTimes.json", allGroceryStoresBusyTimes);

  return allGroceryStoresBusyTimes;
};

const dummyNeighborhoodsData = {
  "Agoura Hills": [
    {
      name: "Trader Joe's",
      rating: 4.6,
      photos: [
        {
          height: 2160,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/116180325053637171179">Dustin LeBrun</a>',
          ],
          photo_reference:
            "CmRaAAAA57S70pqRINT5HBcJgBbVDEKuWDpsNiSpK3lcKIL4b55ZYZWBCY-p-VkKxKhSPp1ftcKesmDibtaxD8P5TdIfStyHPPOpjL4c-yPjVqnJEwRZk6XFppfTu1MlP9811d0FEhBf1TAgX-U3ks-7bwLCIeE0GhQj-VF7B2TU2WFUizZym9Up1bcOgw",
          width: 3840,
        },
      ],
      place_id: "ChIJCRBYda0m6IARQq1nG3y8zNE",
      address: "28941 Canwood St, Agoura Hills, CA 91301, United States",
      location: {
        lat: 34.1464425,
        lng: -118.7566493,
      },
      totalRatings: 528,
      priceLevel: 2,
      openingHours: {
        open_now: false,
        periods: [
          {
            close: {
              day: 0,
              time: "1900",
            },
            open: {
              day: 0,
              time: "0900",
            },
          },
          {
            close: {
              day: 1,
              time: "1900",
            },
            open: {
              day: 1,
              time: "0900",
            },
          },
          {
            close: {
              day: 2,
              time: "1900",
            },
            open: {
              day: 2,
              time: "0900",
            },
          },
          {
            close: {
              day: 3,
              time: "1900",
            },
            open: {
              day: 3,
              time: "0900",
            },
          },
          {
            close: {
              day: 4,
              time: "1900",
            },
            open: {
              day: 4,
              time: "0900",
            },
          },
          {
            close: {
              day: 5,
              time: "1900",
            },
            open: {
              day: 5,
              time: "0900",
            },
          },
          {
            close: {
              day: 6,
              time: "1900",
            },
            open: {
              day: 6,
              time: "0900",
            },
          },
        ],
        weekday_text: [
          "Monday: 9:00 AM – 7:00 PM",
          "Tuesday: 9:00 AM – 7:00 PM",
          "Wednesday: 9:00 AM – 7:00 PM",
          "Thursday: 9:00 AM – 7:00 PM",
          "Friday: 9:00 AM – 7:00 PM",
          "Saturday: 9:00 AM – 7:00 PM",
          "Sunday: 9:00 AM – 7:00 PM",
        ],
      },
    },
    {
      name: "Smart & Final Extra!",
      rating: 4.3,
      photos: [
        {
          height: 3984,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/105466900455373642901">Paul E Ramseyer</a>',
          ],
          photo_reference:
            "CmRaAAAA8i2m4TsQYNXMWeNmlPl5IcYs29utA-iwWq78FK3Im6Gc7zAMk1Fsq-n670gC-JlF5-tcfqOW-SZ9U0qCNAOngqcTWRlnalhRK_0iv-vVFnkhd21M_ZPBaYjjIZwPwtS3EhCpeeGpegjXDC5akxSACibNGhQErloGTUhQpja6FpUWeuhO6jrfiQ",
          width: 2988,
        },
      ],
      place_id: "ChIJ60cc40Ek6IAR8CLk9lxlX40",
      address:
        "5770 Lindero Canyon Rd, Westlake Village, CA 91362, United States",
      location: {
        lat: 34.1537821,
        lng: -118.7945823,
      },
      totalRatings: 87,
      priceLevel: 2,
      openingHours: {
        open_now: false,
        periods: [
          {
            close: {
              day: 0,
              time: "2200",
            },
            open: {
              day: 0,
              time: "0600",
            },
          },
          {
            close: {
              day: 1,
              time: "2200",
            },
            open: {
              day: 1,
              time: "0600",
            },
          },
          {
            close: {
              day: 2,
              time: "2200",
            },
            open: {
              day: 2,
              time: "0600",
            },
          },
          {
            close: {
              day: 3,
              time: "2200",
            },
            open: {
              day: 3,
              time: "0600",
            },
          },
          {
            close: {
              day: 4,
              time: "2200",
            },
            open: {
              day: 4,
              time: "0600",
            },
          },
          {
            close: {
              day: 5,
              time: "2200",
            },
            open: {
              day: 5,
              time: "0600",
            },
          },
          {
            close: {
              day: 6,
              time: "2200",
            },
            open: {
              day: 6,
              time: "0600",
            },
          },
        ],
        weekday_text: [
          "Monday: 6:00 AM – 10:00 PM",
          "Tuesday: 6:00 AM – 10:00 PM",
          "Wednesday: 6:00 AM – 10:00 PM",
          "Thursday: 6:00 AM – 10:00 PM",
          "Friday: 6:00 AM – 10:00 PM",
          "Saturday: 6:00 AM – 10:00 PM",
          "Sunday: 6:00 AM – 10:00 PM",
        ],
      },
    },
  ],
};

getPopularTimes(dummyNeighborhoodsData);
