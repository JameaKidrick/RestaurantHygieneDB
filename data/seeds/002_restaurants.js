const restaurants = require('../dummyData/restaurants')

exports.seed = function(knex) {
  return knex('restaurants')
    .then(function () {
      return knex('restaurants').insert(restaurants);
    });
};
