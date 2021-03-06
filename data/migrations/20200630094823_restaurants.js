
exports.up = function(knex) {
  return knex.schema.createTable('restaurants', table => {
    table
      .increments('restaurant_id');

    table
      .varchar('place_id', 65)
      .unique()
      .notNullable()

    table
      .varchar('restaurant_name', 155)
      .notNullable()

    table
      .varchar('restaurant_address', 155)

    table
      .timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('restaurants');
};
