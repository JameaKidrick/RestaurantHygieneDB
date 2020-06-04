const express = require('express');
const axios = require('axios');

const router = express.Router();
// GOOGLE PLACES API DOCS: https://developers.google.com/places/web-service/search

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
      // WITHOUT locationbias parameter, the API will use the IP address
router.post('/', (req, res) => {
  axios
    .get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${req.body.input}&inputtype=${req.body.inputType}&fields=${req.body.fields}&locationbias=${req.body.location}&key=${process.env.GOOGLE_API_KEY}`)
    .then(response => {
      res.status(200).json(response.data)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})




module.exports = router;