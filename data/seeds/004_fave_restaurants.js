const fave_restaurants = require('../dummyData/fave_restaurants');

exports.seed = function(knex) {
  return knex('fave_restaurants')
    .then(function () {
      return knex('fave_restaurants').insert(fave_restaurants);
    });
};
