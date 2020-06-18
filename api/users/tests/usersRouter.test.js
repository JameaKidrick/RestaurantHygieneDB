const db = require("../../../data/dbConfig");
const server = require("../../server");
const request = require("supertest");

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

describe("Setting up token for authorization", function () {
  let token = ''

  describe("GET all user(s) at /users", function () {
    beforeAll(async () => {
      await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  
      usersDummyData.map(user => {
        return request(server)
          .post('/api/auth/register')
          .send(user)
          .then()
      })
  
      return request(server)
        .post("/api/auth/register")
        .send({
          username: "username4",
          first_name: "first name 4",
          last_name: "last name 4",
          password: "password4",
        })
        .then(response => {
          token = response.body.token
        })
    });
  
    test("Should receive 200: retrieve all users in the database", function () {
      return request(server)
        .get("/api/users")
        .set('Authorization', token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.type).toMatch(/json/i);
          expect(response.body).toHaveLength(4);
        });
    });
  });
  
  describe("GET user at /users/userid", function () {
    test("Should receive 404: user not found", function () {
      const id = 8;
      return request(server)
        .get(`/api/users/${id}`)
        .set('Authorization', token)
        .then((response) => {
          expect(response.status).toEqual(404);
          expect(response.body.error).toMatch(
            `A user with the id ${id} does not exist in the database.`
          );
        });
    });
  
    test("Should receive 200: retrieve specified user from the database", function () {
      const id = 2;
      return request(server)
        .get(`/api/users/${id}`)
        .set('Authorization', token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.user_id).toEqual(2);
          expect(response.body.username).toBe("username2");
        });
    });
  });
  
  describe("PUT user at /users/userid", function () {
    test("Should receive 400: username taken", function () {
      const id = 1;
      const new_user_info = {
        username: "username1",
        first_name: "new_first_name",
      };
  
      return request(server)
        .put(`/api/users/${id}`)
        .set('Authorization', token)
        .send(new_user_info)
        .then((response) => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toBe(
            "There is already a user with that username in the database. Please choose a new username."
          );
        });
    });

    test("Should receive 401: unauthorized/user ids do not match", function () {
      const id = 2;
      const new_user_info = {
        username: "new_username",
        first_name: "new_first_name",
      };
  
      return request(server)
        .put(`/api/users/${id}`)
        .set('Authorization', token)
        .send(new_user_info)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body.error).toBe("You are not authorized to make changes to this account.");
        });
    });
  
    test("Should receive 201: update specified user information", function () {
      const id = 4;
      const new_user_info = {
        username: "new_username",
        first_name: "new_first_name",
      };
  
      return request(server)
        .put(`/api/users/${id}`)
        .set('Authorization', token)
        .send(new_user_info)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body.user.username).toBe("new_username");
          expect(response.body.user.first_name).toBe("new_first_name");
        });
    });
  });
  
  describe("DELETE user at /users/userid", function () {
    test("Should receive 401: unauthorized/user ids do not match", function () {
      const id = 3;
  
      return request(server)
        .delete(`/api/users/${id}`)
        .set('Authorization', token)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body.error).toBe("You are not authorized to make changes to this account.");
        });
    });

    test("Should receive 201: delete specified user", function () {
      const id = 4;
  
      return request(server)
        .delete(`/api/users/${id}`)
        .set('Authorization', token)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body.message).toMatch(
            "User has been successfully deleted."
          );
          expect(response.body.deletedUser.user_id).toEqual(4);
        });
    });
  });  
})