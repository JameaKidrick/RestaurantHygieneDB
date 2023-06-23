const db = require("../../../data/dbConfig");
const {
  find,
  findByRestaurantId,
  findByPlaceId,
  averageRatingByPlace_Id,
  addRestaurant,
  updateRestaurant,
  removeRestaurant,
} = require("../restaurantsModel");

describe("GET restaurant(s)", function () {
  beforeAll(async () => {
    await db.raw("TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE");

    return db.seed.run();
  });

  test("Get all restaurants: retrieve information on all restaurants in the database", async function () {
    const restaurants = await find();

    expect(restaurants).toHaveLength(3);
    expect(restaurants[0].restaurant_id).toEqual(1);
    expect(restaurants[0].place_id).toMatch("ChIJjWYOtykDyokR-kS0ikxSI84");
  });

  test("Get specified restaurant by restaurant_id: retrieve information on a specified restaurant in the database by restaurant_id", async function () {
    const restaurant = await findByRestaurantId(2);

    expect(restaurant.restaurant_id).toEqual(2);
    expect(restaurant.place_id).toMatch("ChIJVZ6MsNkDyokRs884W2r6gE8");
  });

  test("Get specified restaurant by place_id: retrieve information on a specified restaurant in the database by place_id", async function () {
    const restaurant = await findByPlaceId("ChIJGfoMiu77yYkR27U2LdS3y8c");

    expect(restaurant.restaurant_id).toEqual(3);
    expect(restaurant.place_id).toMatch("ChIJGfoMiu77yYkR27U2LdS3y8c");
  });

  test("Get a specific restaurant's average hygiene rating", async function () {
    const average_rating = await averageRatingByPlace_Id(
      "ChIJVZ6MsNkDyokRs884W2r6gE8"
    );

    expect(average_rating).toEqual(4);
  });
});

describe("POST restaurant", function () {
  test("Create a new restaurant: database restaurant count should increase by 1 and the new restaurant's information should be present", async function () {
    const new_restaurant = {
      place_id: "mfAz1Ue3gWR22BaY0haZ549Y",
      restaurant_name: "Test Restaurant",
      restaurant_address: "101 Main Street" // Not Required
    };

    await addRestaurant(new_restaurant);
    const restaurants = await db("restaurants");

    expect(restaurants).toHaveLength(4);
    expect(restaurants[3].restaurant_id).toEqual(4);
    expect(restaurants[3].place_id).toMatch("mfAz1Ue3gWR22BaY0haZ549Y");
  });
});

describe("PUT restaurant", function () {
  test("Update a specified restaurant: should change a restaurant's information", async function () {
    await updateRestaurant(1, { place_id: "IWvbGYEGiCr0QktAxKcgCEMQ" });
    const restaurant = await findByRestaurantId(1);

    expect(restaurant.place_id).toBe("IWvbGYEGiCr0QktAxKcgCEMQ");
  });
});

describe("DELETE restaurant", function () {
  test("Delete a restaurant: should remove specified restaurant from database", async function () {
    await removeRestaurant(4);
    const restaurants = await db("restaurants");
    let restaurantIDs = [];

    restaurants.map((restaurant) => {
      return restaurantIDs.push(restaurant.restaurant_id);
    });

    expect(restaurants).toHaveLength(3);
    expect(restaurantIDs).not.toContain(4);
  });
});
