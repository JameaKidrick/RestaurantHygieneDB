// ✅ ALL TESTS PASSED (./tests/locator.test) ✅

const express = require("express");
const calls = require("./locatorModel");

const router = express.Router();
// GOOGLE PLACES SEARCH API DOCS: https://developers.google.com/places/web-service/search
// GOOGLE GEOCODING API DOCS: https://developers.google.com/maps/documentation/geocoding/start

// Find Place requests
// user can find a specific place based on text data (name, address, or phone number)
// REQUIRED PARAMETERS:
// key - API key
// input - name, address, or phone number; must be a string
// inputtype - textquery or phonenumber (in international format)
// OPTIONAL PARAMETERS:
// fields - properties desired; options: business_status, formatted_address, geometry, icon,name, permanently_closed, photos, place_id, plus_code, types
// WITHOUT fields parameter, only the place_id will be returned
// locationbias - preferred specific area; can use circle:radius@lat,lng OR point:lat,lng
// IF NO PLACE WITHIN, 2000 METERS OF SPECIFICED COORDINATES, PLACE NEAREST TO IP WILL TRY TO BE FOUND
// IF NO PLACE FOUND RESULTS IN CANDIDATES LENGTH === 0 AND STATUS OF 'ZERO_RESULTS'
// WITHOUT locationbias parameter, the API will use the IP address
router.post("/", (req, res) => {
  const key = process.env.GOOGLE_API_KEY;
  const input = req.body.input;
  const inputType = req.body.inputType;
  const fields = req.body.fields;
  const radius = req.body.radius;
  const userLocation = req.body.userLocation;
  console.log("BODY", req.body);
  let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=${inputType}`;

  if (fields !== "") {
    url += `&fields=${fields}`;
  }

  if (!userLocation) {
    res
      .status(400)
      .json({
        error: "Please include the desired location. Please include the State.",
      });
  } else if (!radius) {
    res.status(400).json({ error: "Please include the desired radius." });
  } else {
    calls
      .geocodingAPI(userLocation, key)
      .then((response) => {
        url += `&locationbias=circle:${radius}@${response.lat},${response.lng}`;
        if (!input) {
          res
            .status(400)
            .json({
              error: "Please include the place name, address, or phone number.",
            });
        } else if (!inputType) {
          res
            .status(400)
            .json({
              error:
                "Please define input type. Use either `textquery` or `phonenumber`.",
            });
        } else if (inputType !== "textquery" && inputType !== "phonenumber") {
          res
            .status(400)
            .json({
              error:
                "That is not a valid input type. Please use either `textquery` or `phonenumber`.",
            });
        } else {
          url += `&key=${key}`;
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
      .catch((error) => {
        res.status(500).json({ error: "Internal server error", error });
      });
  }
});

module.exports = router;

/*
BODY {
  input: 'McDonald',
  inputType: 'textquery',
  fields: 'place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed',
  radius: 2000,
  userLocation: { userCity: 'Seattle', userState: 'Washington' }        
}

{
      input: 'McDonald',
      fields: 'place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed',
      radius: 2000,
      userLocation: { userCity: 'Seattle', userState: 'Washington' } 
    }
*/
