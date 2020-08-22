const axios = require("axios");
const restaurantsDB = require("../restaurants/restaurantsModel");

module.exports = {
  placesSearchAPI,
  geocodingAPI,
  placesDetailsAPI,
};

async function placesSearchAPI(url) {
  try {
    const response = await axios.get(url);
    const promises = response.data.results.map(async (place) => {
      await restaurantsDB
        .averageRatingByPlace_Id(place.place_id)
        .then((average) => {
          place["avgHygieneRating"] = average;
        })
        .catch((error) => {
          console.log(error);
        });
      return place;
    });
    const data = await Promise.all(promises);
    response.data.results = data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function geocodingAPI(userLocation, key) {
  let lat = 0;
  let lng = 0;
  let userLocationFormatted = Object.values(userLocation);
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocationFormatted}&key=${key}`
    );
    lat = response.data.results[0].geometry.location.lat;
    lng = response.data.results[0].geometry.location.lng;
  } catch (error) {
    console.log(error);
  }
  return { lat, lng };
}

async function placesDetailsAPI(places_id, key) {
  let data = [];
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${places_id}&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity,opening_hours&key=${key}
    `);
    await restaurantsDB
      .averageRatingByPlace_Id(places_id)
      .then((average) => {
        response.data.result['avgHygieneRating'] = average
      })
      .catch((error) => {
        console.log(error);
      });

    data = response;
  } catch (error) {
    console.log(error);
  }
  return data;
}

/*
{
    "html_attributions": [],
    "result": {
        "address_components": [
            {
                "long_name": "14634",
                "short_name": "14634",
                "types": [
                    "street_number"
                ]
            },
            {
                "long_name": "Apple Harvest Drive",
                "short_name": "Apple Harvest Dr",
                "types": [
                    "route"
                ]
            },
            {
                "long_name": "Martinsburg",
                "short_name": "Martinsburg",
                "types": [
                    "locality",
                    "political"
                ]
            },
            {
                "long_name": "Adam Stephens",
                "short_name": "Adam Stephens",
                "types": [
                    "administrative_area_level_3",
                    "political"
                ]
            },
            {
                "long_name": "Berkeley County",
                "short_name": "Berkeley County",
                "types": [
                    "administrative_area_level_2",
                    "political"
                ]
            },
            {
                "long_name": "West Virginia",
                "short_name": "WV",
                "types": [
                    "administrative_area_level_1",
                    "political"
                ]
            },
            {
                "long_name": "United States",
                "short_name": "US",
                "types": [
                    "country",
                    "political"
                ]
            },
            {
                "long_name": "25401",
                "short_name": "25401",
                "types": [
                    "postal_code"
                ]
            }
        ],
        "adr_address": "<span class=\"street-address\">14634 Apple Harvest Dr</span>, <span class=\"locality\">Martinsburg</span>, <span class=\"region\">WV</span> <span class=\"postal-code\">25401</span>, <span class=\"country-name\">USA</span>",
        "business_status": "OPERATIONAL",
        "formatted_address": "14634 Apple Harvest Dr, Martinsburg, WV 25401, USA",
        "geometry": {
            "location": {
                "lat": 39.4427677,
                "lng": -77.9876383
            },
            "viewport": {
                "northeast": {
                    "lat": 39.44416203029149,
                    "lng": -77.9862693697085
                },
                "southwest": {
                    "lat": 39.4414640697085,
                    "lng": -77.9889673302915
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
        "name": "McDonald's",
        "opening_hours": {
            "open_now": true,
            "periods": [
                {
                    "open": {
                        "day": 0,
                        "time": "0000"
                    }
                }
            ],
            "weekday_text": [
                "Monday: Open 24 hours",
                "Tuesday: Open 24 hours",
                "Wednesday: Open 24 hours",
                "Thursday: Open 24 hours",
                "Friday: Open 24 hours",
                "Saturday: Open 24 hours",
                "Sunday: Open 24 hours"
            ]
        },
        "photos": [
            {
                "height": 2448,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/106090733349027521002\">Carla Werdebaugh</a>"
                ],
                "photo_reference": "CkQ0AAAAKaWJa__qJhT2pP67qto1kmVvByoohirUErPHK8dQQcsAwU3wI-UEEnlGrsOgOWmVa8Q4yS5sFQUyAqeD_OWlahIQNvSRwpEu4uxVkFb-ewRS-RoUcdFwwIgthYYrjrO7fqpQy9Zbix0",
                "width": 3264
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAnSlUDV4kPWAcSt9vyig-cliMOEOK3T8JeK01Y4CA_Z2N98xi0TQ3ndacS6-AenddXJpcRu-qf2Tmqrn1JDjxhhIQLhlcv9Ae9IBSrJ7L8K9VFRoUCg3UKdJJswcNR3mDz4iF7HIqG3w",
                "width": 1025
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAp4S0TXGN0_NyfgJcOPh_EGFf18dsx6C7wBXh10LihuCfrOgDGDyeuPHExBRZzDvSwrYNFRX7mvamUvSQgplwwxIQIMAdHpLR45WJjowOPXe_KRoUvIMNmmT_PZ-hJevKJgT8sv14dbg",
                "width": 1025
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAOjBS_8i7wwLTO7jS-wyF804lZaYDDV6PiJBrkuOH3kK1mtr4XeuGWkS3Fd2K9T0P8id4fpHDeqhCvW64lGC8DRIQk5sKAAdbd-YTk21rYLcHvhoUqYjLZbrGxntRdcnMVcL4HfnRrhc",
                "width": 1025
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAxbpq69VxbKd-NA0xmQwlqC0b0ChW_sjhm_o_tQaO2jh3yF71b0y1KchyX7HcgZArdPqsxYd2DDJgoWtMYe5NPBIQhPE4utCchbn-bO2bxFGM7hoUSgbsy18Z3qBebWhgcP3CLALz2ZQ",
                "width": 1025
            },
            {
                "height": 458,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAg2h62MiRZ3NQiSSad6QLTCo8nNdSRkn_xFlK_gOxgDq9cUuLcHqE8TmEIeBE9l9bksmztbRM-xnTAsPcueEEqxIQPSjo19NUypwkCDlOZe4DWxoUCJazbapQER9cLOt7LjCZ5J6d2Kk",
                "width": 960
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAA4JCDdMLsGCfSlIIH2dg7WzUb0ulwQVeHr_LNo6Zd6L2OwkUkCJARRbiJ2ydcRwqwLhLz7xg5fLBEVR82pKo6qBIQ37kr-f7bWpHL-2KsNP-ERRoUd3abY_6yIoxpeElXiSSZLXUcszY",
                "width": 1025
            },
            {
                "height": 482,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAM16ehIUg8DEa05ELRXHkj1nnmiEay7Zl2y_ac3la12ieXfMNFqlV3Kot72Pw1UQ5ALIk2MgQLHLK45lYFC5s6xIQtE8Hb2HQ0w4E7TQHqg8WyRoU5Z9AQ4oPFwpMUBJTc5-L-MW6AkA",
                "width": 1024
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAQj5fXXlDB6RdX6nDLD94XI0ZpYpFBEfrZlrGsBAiwqHZ8EdgNJBtwGwBnrw8X0IULCVSxAnLiSZ6KEkXWDBI5RIQTjjGl3192xIj6tmIwx6XSxoUxtWlJj4qmhYQ4S0rVamUiprzX20",
                "width": 1025
            },
            {
                "height": 768,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/105756688392532213581\">McDonald&#39;s</a>"
                ],
                "photo_reference": "CkQ0AAAAOG_ssiIqZI2AWjWltiGwXHp_xC8oOm4nn6Y_tm3TqIgQD1_Q6F_H29yZtQKo-NU3VAcyg_TInNE9lzd4eSSW1hIQdK2dEE_fuOPZErLBhd567RoUpGVqtd6bjv0RFbMkqpPRoWUojIg",
                "width": 1025
            }
        ],
        "place_id": "ChIJVZ6MsNkDyokRs884W2r6gE8",
        "plus_code": {
            "compound_code": "C2V6+4W Martinsburg, WV, USA",
            "global_code": "87F4C2V6+4W"
        },
        "types": [
            "cafe",
            "restaurant",
            "food",
            "point_of_interest",
            "store",
            "establishment"
        ],
        "url": "https://maps.google.com/?cid=5728854060719198131",
        "utc_offset": -240,
        "vicinity": "14634 Apple Harvest Drive, Martinsburg"
    },
    "status": "OK"
}
*/
