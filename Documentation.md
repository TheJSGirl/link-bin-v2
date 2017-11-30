## List of end points

## General Apis of Version1

### Register and Login

#### POST /api/register : Create new account
**Request Body** - username, email, password
<br>**Note:** username/password should be minimum 5 chars long
``` javascript
{
  "username" : "bail",
  "email" : "bail2131@gmail.com",
  "password" : "12345"
}
  ```
**Response From Api** - 
``` javascript
{
  "status": "success",
  "data": [],
  "message": "Registration successful, please go to /login"
}
 ```
### POST /api/login : Login with credentials
**Request Body** - email, password
``` javascript
{
  "email" : "bail2131@gmail.com",
  "password" : "12345"
}
```
**Response From Api** - 
``` javascript
{
  "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJUeXBlIjoxLCJpYXQiOjE1MTA5Mzg3MTEsImV4cCI6MTUxMDk0MjMxMX0.pQXZNOKxyL2r9k6zAzWViCU3osyKQr_kvnee71vtSvg"
  },
  "status": "success",
  "message": "login successful"
}
```
**Note :** This token will be use to access the every protected route with the ```x-auth``` key.

<hr>

### Feeds
#### GET /api/feeds : To view the feeds
***Header***
```javascript
{"x-auth": "XXXXXXX" }//JWT token get where user loged in
```
**Note:** You can access this route if you have token.
***Request Body*** : Nothing Required

***Response From Api***
```javascript
{
  "data": [],
  "status": "success",
  "message": "welcome to feeds"
}
```
<hr>

### Manager
#### GET /api/manager : To access manager Area
***Header***
```javascript
{"x-auth": "XXXXXXX" }//JWT token get where user loged in
```
**Note:** You can access this route if you have token.
<br>***Request Body*** : Nothing Required

<br>***Response From Api***
```javascript
{
  "data": [],
  "status": "success",
  "messgae": "welcome nameOfUser, this is manager area"
}
```
<hr>

### Admin
#### GET /api/admin: To access admin area
***Header***
```javascript
{"x-auth": "XXXXXXX" }//JWT token get where user loged in
```
**Note:** You can access this route if you have token.
<br>***Request Body*** : Nothing Required

<br>***Response From Api***
```javascript
{
  "data": [],
  "status": "success",
  "message": "welcome nameOfUser, this is admin area"
}
```



