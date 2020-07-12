const db = require('../../../data/dbConfig');
const {
  find,
  findByRestaurantId,
  findById,
  findUserReview,
  findAllUserReviews,
  averageRating,
  addReview,
  updateReview,
  removeReview
} = require('../reviewsModel');

describe('GET review(s)', function () {
  beforeAll(async () => {
    await db.raw("TRUNCATE TABLE reviews RESTART IDENTITY CASCADE");

    return db.seed.run();
  });

  test('Get all reviews: retrieve information on all reviews in the database', async function () {
    const reviews = await find()

    expect(reviews).toHaveLength(5)
    expect(reviews[1].id).toBe(2)
    expect(reviews[1].restaurant_id).toBe(2)
    expect(reviews[1].review).toMatch('I think they wash their hands and stuff')
    expect(reviews[1].rating).toBe(4)
  })

  test('Get a list of reviews for a specific restaurant by the restaurant\'s id', async function () {
    const reviews = await findByRestaurantId(2)

    expect(reviews).toHaveLength(3)
    expect(reviews[2].id).toBe(3)
    expect(reviews[2].review).toMatch('I saw an employee around the food with no mask on. Kind of gross. The rest of the employees had masks on though.')
    expect(reviews[2].rating).toBe(3)
  })

  test('Get a specific review from the database by the review\'s id', async function () {
    const review = await findById(1)

    expect(review.user_id).toBe(1)
    expect(review.rating).toBe(5)
    expect(review.review).toMatch('McDonald\'s practice great hygiene. All of the employees were wearing masks and gloves.')
  })

  test('Get a specific review by a specified user', async function () {
    const review = await findUserReview(2, 2)

    expect(review.id).toBe(2)
    expect(review.user_id).toBe(2)
    expect(review.rating).toBe(4)
    expect(review.review).toBe('I think they wash their hands and stuff')
  })

  test('Get a list of reviews by a specified user', async function () {
    const reviews = await findAllUserReviews(5)

    expect(reviews).toHaveLength(2)
    expect(reviews[1].review).toBe('dont go hear')
  })

  test('Get the hygiene rating for a restaurant that does not have any ratings by the restaurant\'s id', async function () {
    const avg = await averageRating(1)

    expect(avg).toBe(NaN)
  })

  test('Get the hygiene rating for a restaurant that has ratings by the restaurant\'s id', async function () {
    const avg = await averageRating(2)

    expect(avg).toBe(4)
  })
})

describe('POST review', function () {
  test('Create a new review: database review count should increase by 1 and the new review\'s information should be present', async function () {
    const review = {
      user_id: 3,
      restaurant_id: 1,
      rating: 2,
      review: 'New review here <3'
    }

    await addReview(review.user_id, review.restaurant_id, review.rating, review.review)

    const reviews = await find()

    expect(reviews).toHaveLength(6)
    expect(reviews[5].review).toBe('New review here <3')
  })
})

describe('PUT review', function () {
  test('Update the specified review: should change a review\'s information', async function () {
    await updateReview(6, {rating: '4'})

    const review = await findById(6)

    expect(review.rating).toBe(4)
  })
})

describe('DELETE review', function () {
  test('Delete a review: should remove specified review from the database', async function () {
    await removeReview(6)

    const reviews = await find()

    expect(reviews).toHaveLength(5)
    expect(reviews[reviews.length]).toBe(undefined)
  })
})