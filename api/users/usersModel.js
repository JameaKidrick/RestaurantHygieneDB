// ✅ ALL TESTS PASSED (./tests/usersModel.test) ✅

const db = require("../../data/dbConfig");

module.exports = {
  find,
  findById,
  findByUsername,
  add,
  update,
  remove,
};

// GET ALL USERS IN DATABASE
function find() {
  return db("users").select("user_id", "first_name", "last_name", "username");
}

// GET SPECIFIC USER BY ID
function findById(id) {
  return db("users")
    // .select("user_id", "first_name", "last_name", "username")
    .where({ "users.user_id": id })
    .first()
    .then((user) => {
      return user;
    });
}

// GET SPECIFIC USER BY USERNAME
function findByUsername(username) {
  return db("users")
    .where({ "users.username": username })
    .first()
    .then((user) => {
      return user;
    });
}

// CREATE A NEW USER
function add(user) {
  return db("users")
    .insert(user, "user_id")
    .then((newUser) => {
      return newUser[0].user_id;
    });
}

// UPDATE A USER'S INFORMATION BY USER ID
function update(id, changes) {
  return db("users")
    .update(changes)
    .where({ "users.user_id": id })
    .then((user) => {
      return findById(id);
    });
}

// DELETE A USER BY USER ID
function remove(id) {
  return findById(id).then((user) => {
    return db("users")
      .del()
      .where({ "users.user_id": id })
      .then((deleted) => {
        return user;
      });
  });
}
