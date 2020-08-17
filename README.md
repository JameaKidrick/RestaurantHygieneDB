# **Restaurant Hygiene**

Inspired by the abrupt presence of COVID-19, I wanted to create an app that people could use to rate a restaurant's hygiene. To prevent spreading the virus, restaurant employees are required to wear masks and gloves in addition to their normal hand washing. This app will allow delivery people from DoorDash, Postmates, etc. or customers picking up their food to look for a restaurant and rate/review their hygiene.
___

## **Tech Used**
 - NodeJS
 - ExpressJS
 - PostgreSQL
 - Jest
 - Supertest
 - Google Geocoding API
 - Google Places API
 -----------------------------------------------------
## **ENDPOINTS** 

### _Base URL_
`https://restaurant-hygiene.herokuapp.com/`
### _Authentication_
| Method        | Request URL            | Description                          |
| ------------- | :--------------------: | ------------------------------------ |
| POST          | `/api/auth/register`   | Create a new user                    |
| POST          | `/api/auth/login`      | Creates token to verify a user       |

### _Users_
| Method        | Request URL               | Description                                                                     | Authorization Needed            |
| ------------- | :-----------------------: | ------------------------------------------------------------------------------- | :--------------------: |
| GET           | `/api/users`           | Gets a list of all users                                                      | Token |
| GET           | `/api/users/:userid`       | Get a specific user by user id this is only accessible by logged in users | Token |
| PUT           | `/api/users/:userid`       | Update user by user id          | Token |
| DELETE        | `/api/users/:userid`       | Delete user by user id          | Token |

### _Restaurants_
##### This route works more as a way to join the Restaurant Hygiene database and the Google Places API database. The user will not be able to add, edit, or remove restaurants.
| Method        | Request URL               | Description                                                                     |
| ------------- | :-----------------------: | ------------------------------------------------------------------------------- |
| GET           | `/api/restaurants`           | Gets a list of all restaurants
| GET           | `/api/restaurants/:restaurant_id`       | Get a specific restaurant by its id
| GET           | `/api/restaurants/place/:place_id`       | Get a specific restaurant by its place_id which is originally given by the Google Places API
| GET           | `/api/restaurants/ratings/place/:place_id`       | Get a specific restaurant's average hygiene rating by its place_id
| POST          | `/api/restaurants`    | Create a new restaurant
| PUT           | `/api/restaurants/:restaurant_id`       | Update restaurant by restaurant id
| DELETE        | `/api/restaurants/:restaurant_id`       | Delete restaurant by restaurant id

### _Favorite Restaurants_
| Method        | Request URL               | Description                                                                     | Authorization Needed            |
| ------------- | :-----------------------: | ------------------------------------------------------------------------------- | :--------------------: |
| GET           | `/api/favorites`           | Gets a list of all favorited restaurants          | Token |
| GET           | `/api/favorites/:favorite_id`       | Get a specific favorite restaurant by its id          | Token |
| GET           | `/api/favorites/user/:userid`       | Get a user's favorite restaurants by user id          | Token |
| POST          | `/api/favorites`    | Create a new favorite restaurant          | Token |
| DELETE        | `/api/favorites/:favorite_id`       | Delete favorite restaurant by favorite id          | Token |

### _Reviews_
| Method        | Request URL               | Description                                                                     | Authorization Needed            |
| ------------- | :-----------------------: | ------------------------------------------------------------------------------- | :--------------------: |
| GET           | `/api/reviews`           | Gets a list of all reviews                                                      | Token |
| GET           | `/api/reviews/restaurant/:restaurant_id`       | Get a list of reviews for a specific restaurant by restaurant id | Token |
| GET           | `/api/reviews/:review_id`       | Get a specific review by review id | Token |
| GET           | `/api/reviews/user/:userid`       | Get a list of reviews left by a specific user by user id | Token |
| GET           | `/api/reviews/ratings/restaurant/:restaurant_id`       | Get the average hygiene rating for a specific restaurant by restaurant id | None |
| POST          | `/api/reviews/restaurant/:place_id`       | Create a new review for a restaurant by the place_id   | Token |
| PUT           | `/api/reviews/:review_id`       | Update review or rating by review id          | Token |
| DELETE        | `/api/reviews/:review_id`       | Delete review by review id         | Token |

### _Locator_
| Method        | Request URL            | Description                          | Authorization Needed            |
| ------------- | :--------------------: | ------------------------------------ | :--------------------: |
| POST          | `/api/locate`          | Send form data to locate restaurants by location                    | None |
| POST          | `/api/locate/next`          | Retrieve the next page of restaurants                    | None |

-----------------------------------------------------
## **DATA MODELS** 

### _Authentication_

#### Register
The POST to `/api/auth/register` expects the following data:
```
{
  "username": "username",
  "first_name": "first name",
  "last_name": "last name",
  "password": "password"
}
```

| Property   | Data Type   | Required   | Unique   |
| ---------- | :---------: | :--------: | :------: |
| username   | string      | yes        | yes      |
| first_name | string      | yes        | no       |
| last_name  | string      | yes        | no       |
| password   | string      | yes        | no       |
-----------------------------------------------------
#### Login
The POST to `/api/auth/login` expects the following data:
```
{
  "username": "username",
  "password": "password"
}
```

| Property   | Data Type   | Required   |
| ---------- | :---------: | :--------: |
| username   | string      | yes        |
| password   | string      | yes        |
-----------------------------------------------------
### _Users_

The GET to `/api/users` responds with all of the users in the database:
```
[
  {
      "user_id": 1,
      "first_name": "user1first_name",
      "last_name": "user1last_name",
      "username": "user1"
  },
  {
      "user_id": 2,
      "first_name": "user2first_name",
      "last_name": "user2last_name",
      "username": "user2"
  },
  {
      "user_id": 3,
      "first_name": "user3first_name",
      "last_name": "user3last_name",
      "username": "user3"
  }
]
```
| Property   | Data Type   |
| ---------- | :---------: |
| user_id    | primary key |
| first_name | string      |
| last_name  | string      |
| username   | string      |
-----------------------------------------------------
The GET to `/api/users/userid` responds with the following:
```
{
    "user_id": 1,
    "first_name": "user1first_name",
    "last_name": "user1last_name",
    "username": "user1"
}
```
| Property   | Data Type   |
| ---------- | :---------: |
| user_id    | primary key |
| first_name | string      |
| last_name  | string      |
| username   | string      |
-----------------------------------------------------
The PUT to `/api/users/:userid` expects at least one of the following fields and requires a password confirmation:
```
{
  "first_name": "new_first_name",
  "last_name": "new_last_name",
  "username": "new_username",
  "password": "new_password",
  "confirm_password": "current_password"
}
```
| Property           | Data Type   | Required   |
| ------------------ | :---------: | :--------: |
| first_name         | string      | no         |
| last_name          | string      | no         |
| username           | string      | no         |
| password           | string      | no         |
| confirm_password   | string      | yes        |

Example change:
```
{
  "username": "new_username123",
  "confirm_password": "current_password"
}
```
It will look like this after changing at least one field:

```
{
  "user_id": 1,
  "first_name": "user1first_name",
  "last_name": "user1last_name",
  "username": "new_username123",
}
```
-----------------------------------------------------
The DELETE to `/api/users/:userid` responds with the 'DELETED' object:
```
{
  "message": "User has been successfully deleted.",
  "deletedUser": {
    "user_id": 2,
    "first_name": "user",
    "last_name": "two",
    "username": "user2"
  }
}
```
-----------------------------------------------------
### _Restaurants_

The GET to `/api/restaurants` responds with all of the restaurants in the database:
```
[
  {
    "restaurant_id": 1,
    "place_id": "pZMbHaIecBPUcBEXAMPLEmmgnQo9AT7P",
    "average_rating": null,
    "created_at": "2020-07-01T18:24:47.981Z",
    "updated_at": "2020-07-01T18:24:47.981Z"
  },
  {
    "restaurant_id": 2,
    "place_id": "8a3wdhAceVIYuMEXAMPLE2huVbIBlu2H",
    "average_rating": 5,
    "created_at": "2020-07-01T18:24:47.981Z",
    "updated_at": "2020-07-01T18:24:47.981Z"
  },
  {
    "restaurant_id": 3,
    "place_id": "vE79xcQrtbvN4xEXAMPLEx58WpuMaHF8",
    "average_rating": 2,
    "created_at": "2020-07-01T18:24:47.981Z",
    "updated_at": "2020-07-01T18:24:47.981Z"
  }
]
```
| Property         | Data Type   |
| ---------------- | :---------: |
| restaurant_id    | primary key |
| place_id         | string      |
| average_rating   | integer (null as default)      |
| created_at       | string      |
| updated_at       | string      |
-----------------------------------------------------
The GET to `/api/restaurants/:restaurant_id` responds with the following:
```
{
  "restaurant_id": 2,
  "place_id": "8a3wdhAceVIYuMEXAMPLE2huVbIBlu2H",
  "average_rating": 5,
}
```
| Property         | Data Type   |
| ---------------- | :---------: |
| restaurant_id    | primary key |
| place_id         | string      |
| average_rating   | integer (null as default) |
-----------------------------------------------------
The GET to `/api/restaurants/place/:place_id` responds with the following:
```
{
  "restaurant_id": 2,
  "place_id": "8a3wdhAceVIYuMEXAMPLE2huVbIBlu2H",
  "average_rating": 5,
}
```
| Property         | Data Type   |
| ---------------- | :---------: |
| restaurant_id    | primary key |
| place_id         | string      |
| average_rating   | integer (null as default) |
-----------------------------------------------------
The GET to `/api/restaurants/ratings/place/:place_id` responds with the following:
```
2
```
| Data         | Data Type   |
| ---------------- | :---------: |
| average hygiene rating   | integer (null as default) |
-----------------------------------------------------
The POST to `/api/restaurants` expects the following data:
```
{
  "place_id": "hroVNEWgiUAmoZRESTAURANTwQfX5d52ThEXAMPLE9G0k"
}
```
| Property   | Data Type   | Required   |
| ---------- | :---------: | :--------: |
| place_id   | string      | yes        |
-----------------------------------------------------
The PUT to `/api/restaurants/:restaurant_id` expects at least one of the following fields:
```
{
  "place_id": "pZMbHaIecBPUcBEXAMPLEmmgnQo9AT7P",
  "average_rating": null
}
```
| Property   | Data Type   |
| ---------- | :---------: |
| place_id   | string      |
| average_rating   | integer |

Example change:
```
{
  "average_rating": 5
}
```
It will look like this after changing at least one field:

```
{
  "restaurant_id": 1,
  "place_id": "pZMbHaIecBPUcBEXAMPLEmmgnQo9AT7P",
  "average_rating": 5
}
```
-----------------------------------------------------
The DELETE to `/api/restaurants/:restaurant_id` responds with the 'DELETED' object:
```
{
  "message": "Restaurant successfully deleted!",
  "deletedRestaurant": {
    "restaurant_id": 3,
    "place_id": "vE79xcQrtbvN4xEXAMPLEx58WpuMaHF8",
    "average_rating": 2,
  }
}
```
-----------------------------------------------------
### _Favorite Restaurants_

The GET to `/api/favorites` responds with all of the favorited restaurants in the database:
```
[
  {
    "id": 1,
    "user_id": 1,
    "restaurant_id": 1,
    "created_at": "2020-08-02T17:14:24.514Z",
    "updated_at": "2020-08-02T17:14:24.514Z",
    "place_id": "gJIlgqqBlcEXAMPLEj3ftS8anbjQ64Dl",
    "restaurant_name": "Restaurant 1 Name",
    "restaurant_address": "123 address street, state zip_code"
  },
  {
    "id": 2,
    "user_id": 1,
    "restaurant_id": 2,
    "created_at": "2020-08-02T17:14:24.514Z",
    "updated_at": "2020-08-02T17:14:24.514Z",
    "place_id": "i8yIVkJIN9k7ZEXAMPLEIePDdvpeHL7n",
    "restaurant_name": "Restaurant 2 Name",
    "restaurant_address": "456 address street, state zip_code"
  },
  {
    "id": 3,
    "user_id": 3,
    "restaurant_id": 3,
    "created_at": "2020-08-02T17:14:24.514Z",
    "updated_at": "2020-08-02T17:14:24.514Z",
    "place_id": "92iyelTQpyEXAMPLEmmxy2vurQttOShr",
    "restaurant_name": "Restaurant 3 Name",
    "restaurant_address": "789 address street, state zip_code"
  }
]
```
| Property           | Data Type   |
| ------------------ | :---------: |
| id                 | primary key |
| user_id            | integer      |
| restaurant_id      | integer      |
| created_at         | string      |
| updated_at         | string      |
| place_id           | string      |
| restaurant_name    | string      |
| restaurant_address | string      |
-----------------------------------------------------
The GET to `/api/favorites/:favorite_id` responds with the following:
```
{
  "id": 3,
  "user_id": 3,
  "restaurant_id": 3,
  "created_at": "2020-08-02T17:14:24.514Z",
  "updated_at": "2020-08-02T17:14:24.514Z",
  "place_id": "92iyelTQpyEXAMPLEmmxy2vurQttOShr",
  "restaurant_name": "Restaurant 3 Name",
  "restaurant_address": "789 address street, state zip_code"
}
```
| Property           | Data Type   |
| ------------------ | :---------: |
| id                 | primary key |
| user_id            | integer      |
| restaurant_id      | integer      |
| created_at         | string      |
| updated_at         | string      |
| place_id           | string      |
| restaurant_name    | string      |
| restaurant_address | string      |
-----------------------------------------------------
The GET to `/api/favorites/user/:userid` responds with the following:
```
[
  {
    "id": 1,
    "user_id": 1,
    "restaurant_id": 1,
    "created_at": "2020-08-02T17:14:24.514Z",
    "updated_at": "2020-08-02T17:14:24.514Z",
    "place_id": "gJIlgqqBlcEXAMPLEj3ftS8anbjQ64Dl",
    "restaurant_name": "Restaurant 1 Name",
    "restaurant_address": "123 address street, state zip_code"
  },
  {
    "id": 2,
    "user_id": 1,
    "restaurant_id": 2,
    "created_at": "2020-08-02T17:14:24.514Z",
    "updated_at": "2020-08-02T17:14:24.514Z",
    "place_id": "i8yIVkJIN9k7ZEXAMPLEIePDdvpeHL7n",
    "restaurant_name": "Restaurant 2 Name",
    "restaurant_address": "456 address street, state zip_code"
  }
]
```
| Property           | Data Type   |
| ------------------ | :---------: |
| id                 | primary key |
| user_id            | integer      |
| restaurant_id      | integer      |
| created_at         | string      |
| updated_at         | string      |
| place_id           | string      |
| restaurant_name    | string      |
| restaurant_address | string      |
-----------------------------------------------------
The POST to `/api/favorites` expects the following data:
```
{
  "place_id": "YgGIKUUop38fvEXAMPLE9fDzCAy6ZAy6",
  "restaurant_name": "Restaurant Name".
  "restaurant_address": "123 Restaurant Street, State zip_code
}
```
| Property   | Data Type   | Required   |
| ---------- | :---------: | :--------: |
| place_id   | string      | yes        |
| restaurant_name   | string      | yes        |
| restaurant_address   | string      | no        |
-----------------------------------------------------
The DELETE to `/api/favorites/favorite_id` responds with the 'DELETED' object:
```
{
  "message": "Favorite restaurant was successfully deleted!",
  "deletedFavorite": {
    "id": 2,
    "user_id": 1,
    "restaurant_id": 2,
    "created_at": "2020-08-02T17:14:24.514Z",
    "updated_at": "2020-08-02T17:14:24.514Z",
    "place_id": "i8yIVkJIN9k7ZEXAMPLEIePDdvpeHL7n",
    "restaurant_name": "Restaurant 2 Name",
    "restaurant_address": "456 address street, state zip_code"
  }
}
```
-----------------------------------------------------
### _Reviews_

The GET to `/api/restaurants` responds with all of the reviews in the database:
```
[
  {
    "id": 1,
    "user_id": 1,
    "restaurant_id": 2,
    "rating": 5,
    "review": "They practiced great hygiene. All of the employees were wearing masks and gloves.",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 2,
    "user_id": 2,
    "restaurant_id": 2,
    "rating": 4,
    "review": "I think they wash their hands and stuff",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 3,
    "user_id": 3,
    "restaurant_id": 2,
    "rating": 3,
    "review": "I saw an employee around the food with no mask on. Kind of gross. The rest of the employees had masks on though.",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 4,
    "user_id": 5,
    "restaurant_id": 3,
    "rating": 0,
    "review": "They were not following any of the protocols set out by the state.",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 5,
    "user_id": 5,
    "restaurant_id": 3,
    "rating": 0,
    "review": "Choose another restaurant",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  }
]
```
| Property         | Data Type   |
| ---------------- | :---------: |
| id               | primary key |
| user_id          | integer      |
| restaurant_id    | integer      |
| rating           | integer     |
| review           | string      |
| created_at       | string      |
| updated_at       | string      |
-----------------------------------------------------
The GET to `/api/reviews/restaurant/:restaurant_id` responds with a list of all reviews for a restaurant:
```
[
  {
    "id": 1,
    "user_id": 1,
    "restaurant_id": 2,
    "rating": 5,
    "review": "They practiced great hygiene. All of the employees were wearing masks and gloves.",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 2,
    "user_id": 2,
    "restaurant_id": 2,
    "rating": 4,
    "review": "I think they wash their hands and stuff",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 3,
    "user_id": 3,
    "restaurant_id": 2,
    "rating": 3,
    "review": "I saw an employee around the food with no mask on. Kind of gross. The rest of the employees had masks on though.",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  }
]
```
| Property         | Data Type   |
| ---------------- | :---------: |
| id               | primary key |
| user_id          | integer     |
| restaurant_id    | integer     |
| rating           | integer     |
| review           | string      |
| created_at       | string      |
| updated_at       | string      |
-----------------------------------------------------
The GET to `/api/reviews/:review_id` responds with the following:
```
{
  "id": 3,
  "user_id": 3,
  "restaurant_id": 2,
  "rating": 3,
  "review": "I saw an employee around the food with no mask on. Kind of gross. The rest of the employees had masks on though."
}
```
| Property         | Data Type   |
| ---------------- | :---------: |
| id               | primary key |
| user_id          | integer     |
| restaurant_id    | integer     |
| rating           | integer     |
| review           | string      |
-----------------------------------------------------
The GET to `/api/reviews/user/:userid` responds with a list of all reviews left by a user:
```
[
  {
    "id": 4,
    "user_id": 5,
    "restaurant_id": 3,
    "rating": 0,
    "review": "They were not following any of the protocols set out by the state.",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  },
  {
    "id": 5,
    "user_id": 5,
    "restaurant_id": 3,
    "rating": 0,
    "review": "Choose another restaurant",
    "created_at": "2020-07-11T23:50:38.223Z",
    "updated_at": "2020-07-11T23:50:38.223Z"
  }
]
```
| Property         | Data Type   |
| ---------------- | :---------: |
| id               | primary key |
| user_id          | integer     |
| restaurant_id    | integer     |
| rating           | integer     |
| review           | string      |
| created_at       | string      |
| updated_at       | string      |
-----------------------------------------------------
The GET to `/api/reviews/ratings/restaurant/:restaurant_id` responds with the following:
```
4
```
| Data         | Data Type   |
| ---------------- | :---------: |
| average hygiene rating   | integer |
-----------------------------------------------------
The POST to `/api/reviews/restaurant/:place_id` expects the following data:
```
{
  "rating": 5,
  "review": "This place is great!"
}
```
| Property   | Data Type   | Required   |
| ---------- | :---------: | :--------: |
| rating     | string      | yes        |
| review     | string      | yes        |
-----------------------------------------------------
The PUT to `/api/reviews/:review_id` expects one of the following fields:
```
{
  "rating": 5,
  "review": "This place is great!"
}
```
| Property   | Data Type   | Required   |
| ---------- | :---------: | :--------: |
| rating     | string      | yes        |
| review     | string      | yes        |

Example change:
```
{
  "rating": 5
}
```
It will look like this after changing at least one field:

```
{
  "id": 3,
  "user_id": 3,
  "restaurant_id": 2,
  "rating": 5,
  "review": "I saw an employee around the food with no mask on. Kind of gross. The rest of the employees had masks on though."
}
```
-----------------------------------------------------
The DELETE to `/api/reviews/:review_id` responds with the 'DELETED' object:
```
{
  "message": "Review successfully deleted!",
  "deletedReview": {
    "id": 1,
    "user_id": 1,
    "restaurant_id": 2,
    "rating": 5,
    "review": "They practiced great hygiene. All of the employees were wearing masks and gloves."
  }
}
```
-----------------------------------------------------

## **Google Maps Integration**
`https://cloud.google.com/maps-platform/`

### _Google Geocoding API_
`https://developers.google.com/maps/documentation/geocoding/start`

The project utilized Google's Geocoding API to retrieve the user's specified location's latitude and longitude.

### _Google Places API_
`https://developers.google.com/places/web-service/intro`

The project also utilized Google's Places API to retrieve restaurants and stores within a certain location.

The POST to `/api/locate` will take the specified location of the user or restaurant and find the latitude and longitude coordinates. The coordinates will then be used in addition to any keywords provided to find the nearest restaurant that fits the criteria within a specified radius. Results are 20 restaurants given in ascending order ranked by prevalence. Currently, front end is automatically sending the type as "restaurant" which makes the query optional. If there is no type being sent, query is required.

The POST expects the `required` information:
```
{
  "query": "pizza",
  "userLocation": "Kirkland, Washington"
}
```

The following information is `optional`:
```
{
  "type": "restaurant"
  "radius": 2000
}
```
| Property     | Data Type   | Options |
| ------------ | :---------: | ------- |
| input        | string      | Restaurant Name <br /> Restaurant Address <br /> Food <br /> Etc. |
| userLocation | string      | Address, City, State <br /> City, State |
| type | string      | restaurant <br /> food <br /> etc. |
| radius       | integer     | 2000 <br /> 5000 <br /> 10000 <br /> 20000 <br /> 25000 <br /> 35000 <br /> 40000 <br /> 50000 |

The POST to `/api/locate/next` will take the next page token given from the original `/api/locate` call to get another set of restaurants following the same location/query parameters. The API will retrieve no more than 60 restaurants total, so there will be no more than 2 next page tokens. When there is no next page, the property will be null.

The POST expects the `required` information:
```
{
  "next_page": "CoQBdQAAANQSThnTekt-UokiTiX3oUFEXAMPLEdQJIG0ljlQnkLfWefcKmjxax0xmUpWjmpWdOsEXAMPLEl9zSyBNImmrTO9AE9DnWTdQ2hY7n-OOU4UgCfX7U0TE1Vf7jyODRISbK-u86TBJij0b2i7oUWq2bGr0cQSj8CV97U5q8SJREXAMPLEDYi3ogqEhCMXjNLR1k8fiXTkG2BxGJmGhTqwE8C4grdEXAMPLEAVoOH7v8HQ"
}
```
| Property     | Data Type   | Options |
| ------------ | :---------: | ------- |
| next_page    | string      | Next page token received from the previous API call |

*Last Updated: 8/17/2020 by Jamea Kidrick*
