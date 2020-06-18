# **Restaurant Hygiene**

Inspired by the abrupt presence of COVID-19, I wanted to create an app that people could use to rate a restaurant's hygiene. To prevent spreading the virus, restaurant employees are required to wear masks and gloves in addition to their normal hand washing. This app will allow delivery people from DoorDash, Postmates, etc. or customers picking up their food to look for a restaurant and rate/review their hygiene.
___

## **Tech Used**
 -----------------------------------------------------
 - NodeJS
 - ExpressJS
 - PostgreSQL
 - Jest/Cypress
 - Supertest
 - Google Geocoding API
 - Google Places API
 -----------------------------------------------------
## **ENDPOINTS** 
-----------------------------------------------------
### _Base URL_
`DEPLOYED LINK`
### _Authentication_
| Method        | Request URL            | Description                          |
| ------------- | :--------------------: | ------------------------------------ |
| POST          | `/api/auth/register`   | Create a new user                    |
| POST          | `/api/auth/login`      | Creates token to verify a user       |

### _Users_
| Method        | Request URL               | Description                                                                     |
| ------------- | :-----------------------: | ------------------------------------------------------------------------------- |
| GET           | `/api/users`           | Gets a list of all users                                                      |
| GET           | `/users/users/:userid`       | Get a specific user by user id this is only accessible by logged in users |
| PUT           | `/api/users/:userid`       | Update user by user id this is only available to the specified user          |
| DELETE        | `/api/users/:userid`       | Delete user by user id this is only available to the specified user          | 

### _Locator_
| Method        | Request URL            | Description                          |
| ------------- | :--------------------: | ------------------------------------ |
| POST          | `/api/locate`          | Send form data to locate a restaurant by name, address, or phone                    |

-----------------------------------------------------
## **DATA MODELS** 
-----------------------------------------------------
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
      "username": "user1",
      "created_at": "2020-05-24T02:19:06.850Z",
      "updated_at": "2020-05-24T02:19:06.850Z"
  },
  {
      "user_id": 2,
      "first_name": "user2first_name",
      "last_name": "user2last_name",
      "username": "user2",
      "created_at": "2020-05-24T02:19:06.850Z",
      "updated_at": "2020-05-24T02:19:06.850Z"
  },
  {
      "user_id": 3,
      "first_name": "user3first_name",
      "last_name": "user3last_name",
      "username": "user3",
      "created_at": "2020-05-24T02:19:06.850Z",
      "updated_at": "2020-05-24T02:19:06.850Z"
  }
]
```
| Property   | Data Type   |
| ---------- | :---------: |
| user_id    | primary key |
| first_name | string      |
| last_name  | string      |
| username   | string      |
| created_at | string      |
| updated_at | string      |
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

The POST to `/api/locate` will take the user's specified location and find the latitude and longitude coordinates. The coordinates will then be used in addition to the name, address, or phone number of the restaurant to find the nearest restaurant that fits the criteria within a specified radius.

The POST expects the `required` information:
```
{
  "input": "Mongolian Grill",
  "inputType": "textquery",
  "userLocation": "Kirkland, Washington"
}
```

The following information is `optional`:
```
{
  "fields": "photos,formatted_address,name,opening_hours,rating",
  "radius": 2000
}
```
| Property     | Data Type   | Options |
| ------------ | :---------: | ------- |
| input        | string      | Restaurant Name <br /> Restaurant Address <br /> Restaurant Phone Number |
| inputType    | string      | textquery <br /> phonenumber |
| userLocation | string      | Address, City, State <br /> City, State <br /> State |
| fields       | string      | business_status <br /> formatted_address <br /> geometry <br /> icon <br /> name <br /> permanently_closed <br /> photos <br /> place_id <br /> plus_code <br /> types |
| radius       | integer     | 2000 <br /> 5000 <br /> 10000 <br /> 20000 |

*Last Updated: 6/6/2020 by Jamea Kidrick*
