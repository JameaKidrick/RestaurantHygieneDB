const request = require("supertest");
const server = require("../api/server");

describe("Google APIs: POST /api/locate", function () {
  test.skip("Should receive 400: Missing userLocation", function () {
    const search = {
      input: "McDonald",
      inputType: "textquery",
      fields:
        "place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed",
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

  test.skip("Should receive 400: Missing input", function () {
    const search = {
      inputType: "textquery",
      fields:
        "place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed",
      radius: 2000,
      userLocation: "Seattle, Washington",
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "Please include the place name, address, or phone number."
        );
      });
  });

  test.skip("Should receive 400: Missing inputType", function () {
    const search = {
      input: "McDonald",
      fields:
        "place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed",
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "Please define input type. Use either `textquery` or `phonenumber`."
        );
      });
  });

  test.skip("Should receive 400: Missing radius", function () {
    const search = {
      input: "McDonald",
      inputType: "textquery",
      fields:
        "place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed",
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

  test.skip("Should receive 400: Invalid inputType", function () {
    const search = {
      input: "McDonald",
      inputType: "invalid_inputType",
      fields:
        "place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed",
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.error).toMatch(
          "That is not a valid input type. Please use either `textquery` or `phonenumber`."
        );
      });
  });

  test.skip("Should receive 200: response.data.candidates array is present; json WITH optional fields", function () {
    const search = {
      input: "McDonald",
      inputType: "textquery",
      fields:
        "place_id,business_status,geometry,icon,photos,formatted_address,name,opening_hours,rating,types,permanently_closed",
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(Object.keys(response.body)).toContain("candidates");
      });
  });

  test.skip("Should receive 200: response.data.candidates array is present; json WITHOUT optional fields", function () {
    const search = {
      input: "McDonald",
      inputType: "textquery",
      radius: 2000,
      userLocation: { userCity: "Seattle", userState: "Washington" },
    };
    return request(server)
      .post("/api/locate")
      .send(search)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(Object.keys(response.body)).toContain("candidates");
      });
  });
});
