const request = require("supertest");
const server = require("../../server");

describe("Google APIs: POST /api/locate", function () {
  test.skip("Should receive 400: Missing query AND type", function () {
    const search = {
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "Please include a query if no type is provided."
        );
      });
  });

  test.skip("Should receive 400: Missing userLocation", function () {
    const search = {
      type: "restaurant",
      radius: 2000,
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "Please include the desired location. Please include the State."
        );
      });
  });

  test.skip("Should receive 400: Missing radius", function () {
    const search = {
      type: "restaurant",
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "Please include the desired radius."
        );
      });
  });

  test.skip("Should receive 200: response.data.results array is present; json WITH optional query", function () {
    const search = {
      query: "pizza",
      type: "restaurant",
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(Object.keys(response.body)).toContain("results");
      });
  });

  test.skip("Should receive 200: response.data.results array is present; json WITHOUT optional query", function () {
    const search = {
      type: "restaurant",
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(Object.keys(response.body)).toContain("results");
      });
  });
});

describe("Google APIs: POST /api/locate/next", function () {
  let next = "";

  // beforeAll(() => {
  //   const search = {
  //     type: 'restaurant',
  //     radius: 2000,
  //     userLocation: { userCity: "Seattle", userState: "Washington" },
  //   };
  //   return request(server)
  //     .post("/api/locate")
  //     .send(search)
  //     .then((response) => {
  //       next = response.body.next_page_token
  //     });
  // })

  test.skip("Should receive 400: Missing pagetoken", function () {
    return request(server)
      .post("/api/locate/next")
      .send({})
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "Please include the pagetoken that is received from the previous axios call's response data."
        );
      });
  });

  test.skip("Should receive 200: response.data.results array is present after receiving next page", async function () {
    let test = await request(server)
      .post("/api/locate/next")
      .send({ pageToken: next })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(Object.keys(response.body)).toContain("results");
      });
  });
});

describe("Google APIs: POST /api/locate/details", function () {
  test.skip("Should receive 400: Missing places_id", function () {
    return request(server)
      .post("/api/locate/details")
      .send({})
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch("Please include the places_id.");
      });
  });

  test.skip("Should receive 200: response.data.results array is present after retrieving detailed information about restaurant", function () {
    return request(server)
      .post("/api/locate/details")
      .send({ places_id: "ChIJN1t_tDeuEmsRUsoyG83frY4" })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(Object.keys(response.body)).toContain("result");
      });
  });
});
