
exports.up = function(knex) {
  return knex.schema.createTable('fave_restaurants', table => {
    table
      .increments('id');

    table
      .integer('user_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');

    table
      .integer('restaurant_id', 65)
      .unsigned()
      .references('restaurant_id')
      .inTable('restaurants')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()

    table
      .timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('fave_restaurants');
};
