
exports.up = function(knex) {
  return knex.schema.createTable('restaurants', table => {
    table
      .increments('restaurant_id');

    table
      .varchar('place_id', 65)
      .unique()
      .notNullable()

    table
      .integer('average_rating')

    table
      .timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('restaurants');
};
