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
| GET           | `/users/users/:userid`       | Get a specific user by user id this is only accessible by logged in users | Token |
| PUT           | `/api/users/:userid`       | Update user by user id this is only available to the specified user          | Token |
| DELETE        | `/api/users/:userid`       | Delete user by user id this is only available to the specified user          | Token |

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
The PUT to `/api/users/:userid` expects at least one of the following fields:
```
{
  "first_name": "new_first_name",
  "last_name": "new_last_name",
  "username": "new_username",
}
```
| Property   | Data Type   |
| ---------- | :---------: |
| first_name | string      |
| last_name  | string      |
| username   | string      |

Example change:
```
{
  "username": "new_username123",
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

*Last Updated: 6/29/2020 by Jamea Kidrick*
