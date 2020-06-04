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
    // IF NO PLACE WITHIN, 2000 METERS OF SPECIFICED COORDINATES, PLACE NEAREST TO IP WILL TRY TO BE FOUND
    // IF NO PLACE FOUND RESULTS IN CANDIDATES LENGTH === 0 AND STATUS OF 'ZERO_RESULTS'
      // WITHOUT locationbias parameter, the API will use the IP address
router.post('/', (req, res) => {
  const key = process.env.GOOGLE_API_KEY
  const input = req.body.input
  const inputType = req.body.inputType
  const fields = req.body.fields
  const location = req.body.location
  let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=${inputType}`

  if(fields !== ''){
    url += `&fields=${fields}`
  }
  if(location !== ''){
    url += `&locationbias=${location}`
  }

  url += `&key=${key}`
  console.log('INPUT', location, url)

  if(!input){
    res.status(400).json({ error: 'Please include the place name, address, or phone number.' })
  }else if(!inputType){
    res.status(400).json({ error: 'Please define input type. Use either `textquery` or `phonenumber`.' })
  }else if((inputType !== 'textquery') && (inputType !== 'phonenumber')){
    res.status(400).json({ error: 'That is not a valid input type. Please use either `textquery` or `phonenumber`.'})
  }else {
    axios
      .get(url)
      .then(response => {
        res.status(200).json(response.data)
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
  }
})






module.exports = router;