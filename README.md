# En Passant Backend

Backend API for the En Passant project, built with Node.js, Express, MongoDB/Mongoose, bcrypt, and JWT authentication.

## Tech Stack

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

## Project Structure

```text
enpassant-technical/
├── index.js
├── package.json
├── package-lock.json
└── src/
    ├── config/
    │   ├── db.js
    │   ├── isAdmin.js
    │   └── verifyToken.js
    ├── models/
    │   ├── Resource.js
    │   └── User.js
    └── routes/
        ├── authRoutes.js
        └── resourceRoutes.js
```

## Setup

### 1. Prerequisites

Install:

- Node.js 18 or newer
- A MongoDB database, such as MongoDB Atlas

### 2. Install dependencies

From the project root:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

#### Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs |
| `PORT` | No | Server port. Defaults to `5000` |

Do not commit `.env` or expose `JWT_SECRET`.

For MongoDB Atlas, make sure the machine's public IP address is allowed in the Atlas IP Access List.

### 4. Start the server

```bash
node index.js
```

Expected output:

```text
Server is running on port 5000
MongoDB connected successfully
```

The API base URL is:

```text
http://localhost:5000
```

## Authentication

Authentication uses JWT.

After a successful login, the API returns a token:

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

For protected endpoints, send the token using:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

New users are assigned the `team` role by default. Resource creation, updating, and deletion require the `admin` role.

## API Endpoints

### Authentication

#### POST `/signup`

Creates a new team user.

**Request body:**

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

**Success response: `201 Created`**

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "role": "team"
}
```

Possible errors:

- `400` Missing required fields
- `400` Email already exists
- `400` Username already exists
- `500` Server error

---

#### POST `/login`

Authenticates a user and returns a JWT.

**Request body:**

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Success response: `200 OK`**

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

Possible errors:

- `400` Missing email/password
- `404` Email not found
- `401` Invalid password
- `500` Server error

---

#### GET `/me`

Returns the currently authenticated user's information.

**Authentication:** Required

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success response: `200 OK`**

```json
{
  "_id": "USER_ID",
  "username": "testuser",
  "email": "test@example.com",
  "role": "team"
}
```

The password is excluded from the response.

Possible errors:

- `401` No token
- `401` Invalid token
- `500` Server error

## Resource Endpoints

All resource endpoints require a valid JWT.

### GET `/resources`

Returns all resources.

**Authentication:** Required

**Success response: `200 OK`**

```json
[
  {
    "_id": "RESOURCE_ID",
    "title": "Example Resource",
    "description": "Example description"
  }
]
```

---

### GET `/resources/:id`

Returns a single resource by MongoDB ID.

**Authentication:** Required

Example:

```text
GET /resources/RESOURCE_ID
```

**Success response: `200 OK`**

```json
{
  "_id": "RESOURCE_ID",
  "title": "Example Resource",
  "description": "Example description"
}
```

Possible errors:

- `404` Resource not found
- `500` Server error

---

### POST `/resources`

Creates a new resource.

**Authentication:** Required  
**Role:** Admin only

**Request body:**

```json
{
  "title": "Example Resource",
  "description": "Example description"
}
```

**Success response: `201 Created`**

```json
{
  "_id": "RESOURCE_ID",
  "title": "Example Resource",
  "description": "Example description"
}
```

Possible errors:

- `401` Missing/invalid token
- `403` Admins only
- `500` Server error

---

### PUT `/resources/:id`

Updates an existing resource.

**Authentication:** Required  
**Role:** Admin only

Example:

```text
PUT /resources/RESOURCE_ID
```

**Request body:**

```json
{
  "title": "Updated Resource",
  "description": "Updated description"
}
```

**Success response: `200 OK`**

```json
{
  "_id": "RESOURCE_ID",
  "title": "Updated Resource",
  "description": "Updated description"
}
```

Possible errors:

- `401` Missing/invalid token
- `403` Admins only
- `404` Resource not found
- `500` Server error

---

### DELETE `/resources/:id`

Deletes an existing resource.

**Authentication:** Required  
**Role:** Admin only

Example:

```text
DELETE /resources/RESOURCE_ID
```

**Success response: `200 OK`**

```json
{
  "message": "Resource deleted"
}
```

Possible errors:

- `401` Missing/invalid token
- `403` Admins only
- `404` Resource not found
- `500` Server error

## Quick Testing Flow

Use Postman, Thunder Client, or another API client.

```text
1. POST /signup
       ↓
2. POST /login
       ↓
3. Copy JWT token
       ↓
4. GET /me with Bearer token
       ↓
5. GET /resources with Bearer token
       ↓
6. Use an admin JWT for POST/PUT/DELETE /resources
```

## Current Role Model

The User model supports:

```text
team
admin
```

New signups default to:

```text
team
```

Only admins can create, update, or delete resources.

## Notes

- MongoDB automatically provides each document with an `_id`.
- Passwords are hashed with bcrypt before being stored.
- JWTs expire after 1 day.
- Never commit real MongoDB credentials or JWT secrets to version control.
