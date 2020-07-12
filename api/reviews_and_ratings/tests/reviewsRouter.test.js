const db = require("../../../data/dbConfig");
const server = require("../../server");
const request = require("supertest");

describe("Setting up token for authorization", function () {
  let token = "";

  describe("GET review(s) and info at /reviews", function () {
    beforeAll(async () => {
      await db.raw("TRUNCATE TABLE reviews RESTART IDENTITY CASCADE");
      await db.raw("TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE");

      await db.seed.run();

      return request(server)
        .post("/api/auth/register")
        .send({
          username: "username4",
          first_name: "first name 4",
          last_name: "last name 4",
          password: "password4",
        })
        .then((response) => {
          token = response.body.token;
        });
    });

    test("Should receive 400: token missing", function () {
      return request(server)
        .get("/api/reviews")
        .then((response) => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toMatch("Please provide credentials");
        });
    });

    test("Should receive 200: retrieve all reviews in the database", function () {
      return request(server)
        .get("/api/reviews")
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.type).toMatch(/json/i);
          expect(response.body).toHaveLength(5);
        });
    });

    test("Should receive 404: restaurant id not in database", function () {
      const id = 800;
      return request(server)
        .get(`/api/reviews/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(404);
          expect(response.body.error).toBe(
            `There is no review in the database with the id ${id}`
          );
        });
    });

    test("Should receive 200: no reviews for the restaurant", function () {
      const id = 1;
      return request(server)
        .get(`/api/reviews/restaurant/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.message).toBe(
            "There are no reviews for this restaurant."
          );
        });
    });

    test("Should receive 200: retrieve a list of reviews for the restaurant by restaurant id", function () {
      const id = 2;
      return request(server)
        .get(`/api/reviews/restaurant/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveLength(3);
        });
    });

    test("Should receive 404: review id not in database", function () {
      const id = 800;
      return request(server)
        .get(`/api/reviews/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(404);
          expect(response.body.error).toBe(
            `There is no review in the database with the id ${id}`
          );
        });
    });

    test("Should receive 200: retrieve information about specified review by review id", function () {
      const id = 2;
      return request(server)
        .get(`/api/reviews/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.review).toBe(
            "I think they wash their hands and stuff"
          );
        });
    });

    test("Should receive 404: user id not in database", function () {
      const user_id = 500;
      return request(server)
        .get(`/api/reviews/user/${user_id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(404);
          expect(response.body.error).toBe(
            "A user with the id 500 does not exist in the database."
          );
        });
    });

    test("Should receive 200: retrieve a list of reviews made by a user by user id", function () {
      const user_id = 5;
      return request(server)
        .get(`/api/reviews/user/${user_id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveLength(2);
        });
    });

    test("Should receive 200: retrieve the restaurant's average hygiene rating by restaurant id", function () {
      const id = 2;
      return request(server)
        .get(`/api/reviews/ratings/restaurant/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toBe(4);
        });
    });
  });

  describe("POST review at /reviews", function () {
    test("Should receive 400: review missing", function () {
      const new_review = {
        rating: 2,
      };

      return request(server)
        .post("/api/reviews/restaurant/bRaNdNeWpLaCe_IdHeRe")
        .send(new_review)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toBe("Please add a review");
        });
    });

    test("Should receive 400: rating missing", function () {
      const new_review = {
        review: "I don't recommend this place, but whatever...",
      };

      return request(server)
        .post("/api/reviews/restaurant/bRaNdNeWpLaCe_IdHeRe")
        .send(new_review)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(400);
          expect(response.body.error).toBe("Please add a rating");
        });
    });

    test("Should receive 201: create a new review for a restaurant that is NOT in the database", function () {
      const new_review = {
        review: "I don't recommend this place, but whatever...",
        rating: 2,
      };

      return request(server)
        .post("/api/reviews/restaurant/bRaNdNeWpLaCe_IdHeRe")
        .send(new_review)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body.message).toBe("Review successfully posted!");
        });
    });

    test("Should receive 201: create a new review for a restaurant that is in the database", function () {
      const new_review = {
        review: "I agree with the above review. Just go to a different place.",
        rating: 1,
      };

      return request(server)
        .post("/api/reviews/restaurant/bRaNdNeWpLaCe_IdHeRe")
        .send(new_review)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body.message).toBe("Review successfully posted!");
        });
    });
  });

  describe("PUT review at /reviews/review_id", function () {
    test("Should receive 401: unauthorized user because review creator's id does not match user that is attempting to alter the review", function () {
      const id = 4;
      const edit_review = {
        rating: 3,
      };

      return request(server)
        .put(`/api/reviews/${id}`)
        .set("Authorization", token)
        .send(edit_review)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body.error).toBe(
            "You are not authorized to alter this review"
          );
        });
    });

    test("Should receive 401: user attempts to alter something that is not the review or rating", function () {
      const id = 6;
      const edit_review = {
        id: 3,
      };

      return request(server)
        .put(`/api/reviews/${id}`)
        .set("Authorization", token)
        .send(edit_review)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body.error).toBe(
            "You are not authorized to alter the id"
          );
        });
    });

    test("Should receive 201: review information is updated", function () {
      const id = 6;
      const edit_review = {
        rating: 3,
      };

      return request(server)
        .put(`/api/reviews/${id}`)
        .set("Authorization", token)
        .send(edit_review)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body.message).toBe("Review successfully updated!");
          expect(response.body.updatedReview.rating).toBe(3);
        });
    });
  });

  describe("DELETE review at /reviews/review_id", function () {
    test("Should receive 201: review is deleted from the database", function () {
      const id = 7;
      return request(server)
        .delete(`/api/reviews/${id}`)
        .set("Authorization", token)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body.message).toBe("Review successfully deleted!");
          expect(response.body.deletedReview.id).toBe(7);
        });
    });
  });
});
