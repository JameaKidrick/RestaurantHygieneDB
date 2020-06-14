const db = require("../../../data/dbConfig");
const {
  find,
  findById,
  findByUsername,
  add,
  update,
  remove,
} = require("../usersModel");

const usersDummyData = [
  {
    username: "username1",
    first_name: "first name 1",
    last_name: "last name 1",
    password: "password1",
  },
  {
    username: "username2",
    first_name: "first name 2",
    last_name: "last name 2",
    password: "password2",
  },
  {
    username: "username3",
    first_name: "first name 3",
    last_name: "last name 3",
    password: "password3",
  },
];

describe("GET user(s)", function () {
  beforeAll(async () => {
    await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

    usersDummyData.map((user) => {
      return add(user);
    });
  });

  test("Get all users: retrieve information on all users in the database", async function () {
    const users = await find();

    expect(users).toHaveLength(3);
    expect(users[0].user_id).toEqual(1);
    expect(users[0].username).toBe("username1");
  });

  test("Get specified user by ID: retrieve information on a specified user in the database by user_id", async function () {
    const user = await findById(2);

    expect(user.user_id).toEqual(2);
    expect(user.username).toBe("username2");
  });

  test("Get specified user by username: retrieve information on a specified user in the database by user_username", async function () {
    const user = await findByUsername("username3");

    expect(user.user_id).toEqual(3);
    expect(user.username).toBe("username3");
  });
});

describe("POST user", function () {
  test("Create a new user: database user count should increase by 1", async function () {
    const new_user = {
      username: "username4",
      first_name: "first_name 4",
      last_name: "last_name 4",
      password: "password4",
    };

    await add(new_user);
    const users = await db("users");

    expect(users).toHaveLength(4);
    expect(users[3].user_id).toEqual(4);
    expect(users[3].username).toBe("username4");
  });
});

describe("PUT user", function () {
  test("Update a specified user: should change user specified information", async function () {
    await update(2, { username: "username5" });
    const user = await findById(2);

    expect(user.username).toBe("username5");
  });
});

describe("DELETE user", function () {
  test("Delete a user: should remove specified user from database", async function () {
    await remove(4);
    const users = await db("users");
    let userIDs = [];

    users.map((user) => {
      return userIDs.push(user.user_id);
    });

    expect(users).toHaveLength(3);
    expect(userIDs).not.toContain(4);
  });
});
