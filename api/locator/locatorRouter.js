// ✅ ALL TESTS PASSED (./tests/locator.test) ✅

const express = require("express");
const calls = require("./locatorModel");

const router = express.Router();

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

  if(!pageToken){
    res.status(400).json({ error: 'Please include the pagetoken that is received from the previous axios call\'s response data.' })
  }else{
    calls
      .placesSearchAPI(url)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error", error });
      });
  }
})

router.post('/details', (req, res) => {
  const places_id = req.body.places_id
  const key = process.env.GOOGLE_API_KEY

  if(!places_id){
    res.status(400).json({ error: 'Please include the places_id.' })
  }else{
    calls
      .placesDetailsAPI(places_id, key)
      .then(response => {
        res.status(200).json(response.data)
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error", error });
      });
  }
})

module.exports = router;