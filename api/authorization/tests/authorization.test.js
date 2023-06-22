const request = require("supertest");
const server = require("../../server");
const db = require("../../../data/dbConfig");

// // TEST OF THE TESTING
// const can = {
//   name: 'pamplemousse',
//   ounces: 12,
// };

// describe('the can', () => {
//   test('has 12 ounces', () => {
//     expect(can.ounces).toBe(12);
//   });

//   test('has a sophisticated name', () => {
//     expect(can.name).toBe('pamplemousse');
//   });
// });

describe("Register: POST /register", function () {
  afterEach(() => {
    return db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  test("Should receive 400: Missing username", function () {
    const new_user = {
      first_name: "first name",
      last_name: "last name",
      password: "password",
    };
    return request(server)
      .post("/api/auth/register")
      .send(new_user)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please provide a username.");
      });
  });

  test("Should receive 400: Missing password", function () {
    const new_user = {
      username: "username",
      first_name: "first name",
      last_name: "last name",
    };
    return request(server)
      .post("/api/auth/register")
      .send(new_user)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please provide a password.");
      });
  });

  test("Should receive 400: Missing first name", function () {
    const new_user = {
      username: "username",
      last_name: "last name",
      password: "password",
    };
    return request(server)
      .post("/api/auth/register")
      .send(new_user)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please provide a first name.");
      });
  });

  test("Should receive 400: Missing last name", function () {
    const new_user = {
      username: "username",
      first_name: "first name",
      password: "password",
    };
    return request(server)
      .post("/api/auth/register")
      .send(new_user)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please provide a last name.");
      });
  });

  test("Should receive 400: Username already taken", async function () {
    const new_user = {
      username: "username",
      first_name: "first name",
      last_name: "last name",
      password: "password",
    };
    const new_user2 = {
      username: "username",
      first_name: "first name2",
      last_name: "last name2",
      password: "password2",
    };
    await request(server).post("/api/auth/register").send(new_user);

    return request(server)
      .post("/api/auth/register")
      .send(new_user2)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "There is already a user with that username in the database. Please choose a new username."
        );
      });
  });

  test("Should receive 500: Internal server error", function () {
    const new_user = {
      username: "username",
      first_name: "first name",
      last_name: "last name",
      password: "password",
      extra: "extra",
    };
    return request(server)
      .post("/api/auth/register")
      .send(new_user)
      .then((response) => {
        expect(response.status).toEqual(500);
      });
  });

  test("Should receive 201: Registration success, JSON formatted response, and has a token", function () {
    const new_user = {
      username: "username",
      first_name: "first name",
      last_name: "last name",
      password: "password",
    };
    return request(server)
      .post("/api/auth/register")
      .send(new_user)
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.type).toMatch(/json/i);
        expect(Object.keys(response.body)).toContain("token");
      });
  });
});

describe("Login: POST /login", function () {
  beforeAll(async () => {
    const new_user = {
      username: "username",
      first_name: "first name",
      last_name: "last name",
      password: "password",
    };
    return request(server).post("/api/auth/register").send(new_user);
  });

  test("Should receive 400: Missing username", function () {
    const user = {
      password: "password",
    };
    return request(server)
      .post("/api/auth/login")
      .send(user)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please provide a username.");
      });
  });

  test("Should receive 400: Missing password", function () {
    const user = {
      username: "username",
    };
    return request(server)
      .post("/api/auth/login")
      .send(user)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please provide a password.");
      });
  });

  test("Should receive 401: Wrong username", function () {
    const user = {
      username: "wrong_username",
      password: "password",
    };
    return request(server)
      .post("/api/auth/login")
      .send(user)
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.error).toMatch(
          "Invalid credentials: Please check your username and try again."
        );
      });
  });

  test("Should receive 401: Wrong password", function () {
    const user = {
      username: "username",
      password: "wrong_password",
    };
    return request(server)
      .post("/api/auth/login")
      .send(user)
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.error).toMatch(
          "Invalid credentials: Please check your password and try again."
        );
      });
  });

  test("Should receive 201: Login success, JSON formatted response, and has a token", function () {
    const user = {
      username: "username",
      password: "password",
    };
    return request(server)
      .post("/api/auth/login")
      .send(user)
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.type).toMatch(/json/i);
        expect(Object.keys(response.body)).toContain("token");
      });
  });
});
