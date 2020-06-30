const reviews = require('../dummyData/reviews');

exports.seed = function(knex) {
  return knex('reviews')
    .then(function () {
      return knex('reviews').insert(reviews);
    });
};
