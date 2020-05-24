
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table
      .increments('user_id');

    table
      .varchar('first_name', 155).notNullable()

    table
      .varchar('last_name', 155).notNullable()

    table
      .varchar('username', 65).notNullable().unique()

    table
      .varchar('password', 65).notNullable()

    table
      .timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
