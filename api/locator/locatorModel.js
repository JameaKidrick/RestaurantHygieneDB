const axios = require('axios');
const restaurantsDB = require('../restaurants/restaurantsModel');

module.exports = {
  placesSearchAPI,
  geocodingAPI,
  placesDetailsAPI
}

async function placesSearchAPI(url){
  try{
    const response = await axios.get(url)
    const promises =  response.data.results.map(async place => {
      await restaurantsDB.averageRatingByPlace_Id(place.place_id)
        .then(average => {
          place['avgHygieneRating'] = average
        })
        .catch(error => {
          console.log(error)
        })
      return place
    })
    const data = await Promise.all(promises)
    response.data.results = data
    return response
  } catch(error) {
    console.log(error)
  }
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
    console.log(error)
  }
  return { lat, lng }
}

async function placesDetailsAPI(places_id, key){
  let data = []
  try{
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${places_id}&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity&key=${key}
    `);
    data = response
  }catch (error) {
    console.log(error)
  }
  return data
}