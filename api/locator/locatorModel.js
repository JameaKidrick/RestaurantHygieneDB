const axios = require('axios');

module.exports = {
  placesSearchAPI,
  geocodingAPI
}

async function placesSearchAPI(url){
  let data = []
  try{
    const response = await axios.get(url);
    data = response
  } catch(error) {
    console.log('AXIOS CALL ERROR', error)
  }
  return data
}

async function geocodingAPI(userLocation, key){
  let lat = 0
  let lng = 0
  let userLocationFormatted = Object.values(userLocation)

  try{
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${userLocationFormatted}&key=${key}`);
    lat = response.data.results[0].geometry.location.lat
    lng = response.data.results[0].geometry.location.lng
  } catch(error) {
    console.log('AXIOS CALL ERROR', error)
  }
  return { lat, lng }
}