const db = require('../../../data/dbConfig');
const {
  findAll,
  findByID,
  findByUserID,
  addFavorite,
  removeFavorite
} = require('../fave_restaurantsModel');

describe('GET favorite restaurant(s)', function () {
  beforeAll(async () => {
    await db.raw("TRUNCATE TABLE reviews RESTART IDENTITY CASCADE");

    return db.seed.run();
  });

  test('Get all favorite restaurants: retrieve information on all favorite restaurants in the database', async function () {
    const faves = await findAll()

    expect(faves).toHaveLength(4)
    expect(faves[2].restaurant_id).toBe(2)
  })

  test('Get a specific favorite restaurant connection by junction id: retrieve information on specific favorite restaurant by junction id', async function () {
    const fave = await findByID(4)

    expect(fave.user_id).toBe(3)
    expect(fave.restaurant_id).toBe(1)
  })

  test('Get a list of favorite restaurants by user id: retrieve information on all favorite restaurant by user id', async function () {
    const faves = await findByUserID(2)

    expect(faves).toHaveLength(2)
    expect(faves[0].restaurant_id).toBe(1)
  })
})

describe('POST favorite restaurant', function () {
  test('Create a new favorite restaurant connection', async function () {
    const new_favorite = {
      user_id: 1,
      restaurant_id: 1,
    }

    await addFavorite(new_favorite)

    const faves = await findAll()

    expect(faves).toHaveLength(5)
    expect(faves[4].restaurant_id).toBe(1)
  })
})

describe('DELETE favorite restaurant', function () {
  test('Delete a favorite restaurant: should remove specified favorite restaurant from database', async function () {
    const id = 5

    await removeFavorite(id)

    const faves = await findAll()

    expect(faves).toHaveLength(4)
    expect(faves[3].user_id).toBe(3)
  })
})