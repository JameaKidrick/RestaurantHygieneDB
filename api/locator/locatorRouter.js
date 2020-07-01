// ✅ ALL TESTS PASSED (./tests/locator.test) ✅

const express = require("express");
const calls = require("./locatorModel");
const reviewsModel = require('../reviews_and_ratings/reviewsModel');

const router = express.Router();
// GOOGLE PLACES SEARCH API DOCS: https://developers.google.com/places/web-service/search
// GOOGLE GEOCODING API DOCS: https://developers.google.com/maps/documentation/geocoding/start

// Text Search requests *********
  // user can find a group of places based on a string provided (for example "pizza in New York" or "shoe stores near Ottawa" or "123 Main Street")
  // REQUIRED PARAMETERS:
    // key - API key
    // query - must be a string to search by  (optional, if type is provided)
  // OPTIONAL PARAMETERS:
    // location - preferred specific area (lat,lng)
    // radius - distance within location in meters; max is 50000
    // type - specified type of place (used restaurant here)
    // pagetoken - returns up to 20 results using the same parameters used previously so parameters given with this pagetoken will be ignored

// HOW MY API WILL WORK:
  // DB will use Text Search. Client side provides location, radius, and type. Since type is provided, the query is optional.

router.post("/", (req, res) => {
  const key = process.env.GOOGLE_API_KEY;
  const query = req.body.query;
  const type = req.body.type;
  const radius = req.body.radius;
  const userLocation = req.body.userLocation;
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?`

  if(!query && !type){
    res
      .status(400)
      .json({
        error: 'Please include a query if no type is provided.'
      })
  }else if (!userLocation) {
    res
      .status(400)
      .json({
        error: "Please include the desired location. Please include the State."
      });
  } else if (!radius) {
    res.status(400).json({ error: "Please include the desired radius." });
  } else {
    calls
      .geocodingAPI(userLocation, key)
      .then((response) => {
        if(query){
          url += `query=${query}`
        }

        url += `&location=${response.lat},${response.lng}&radius=${radius}&type=${type}&key=${key}`
        calls
          .placesSearchAPI(url)
          .then((response) => {
            res.status(200).json(response.data)
          })
          .catch((error) => {
            res.status(500).json({ error: "Internal server error", error });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error", error });
      });
  }
});

router.post('/next', (req, res) => {
  const key = process.env.GOOGLE_API_KEY;
  const pageToken = req.body.pageToken
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?&pagetoken=${pageToken}&key=${key}`

  calls
    .placesSearchAPI(url)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error", error });
    });
})

module.exports = router;