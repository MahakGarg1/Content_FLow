<h1 align="center">CONTENT FLOW - CONTENT MANAGEMENT SYSTEM</h1>

This is a simple Content Management System built using Node.js, Express.js, MongoDB, and other technologies. It provides basic functionality for managing content posts, categories, and comments.

## Features

`User Authentication`

Users can register, log in, and log out. Passwords are securely hashed using bcrypt.

`Post Management`

Admin users can create, edit, and delete content posts. Posts can include titles, descriptions, categories, and images.

 `Category Management`

Admin users can create and edit content categories.

`Comment System`

Users can submit comments on content posts. Admins can review and manage comments.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for storing content posts, categories, users, and comments.
- **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Bcrypt:** Library for hashing passwords.
- **Express Session:** Middleware for handling sessions.
- **Connect Flash:** Middleware for displaying flash messages.
- **Multer:** Middleware for handling file uploads.

## Data Models

### Category Model

The `Category` model represents content categories within the system.

- **Fields:**
  - `title`: String (required) - The title of the category.

  ### Comment Model

The `Comment` model represents comments made on content posts.

- **Fields:**
  - `body`: String (required) - The content of the comment.
  - `user`: ObjectId (ref: 'user') - The user who submitted the comment.
  - `date`: Date - The date when the comment was created.
  - `commentIsApproved`: Boolean - A flag indicating whether the comment is approved (default: true).

  ### Post Model

The `Post` model represents individual blog posts.

- **Fields:**
  - `title`: String (required) - The title of the post.
  - `status`: String - The status of the post (default: 'public').
  - `description`: String (required) - The content of the post.
  - `creationDate`: Date - The date when the post was created.
  - `user`: ObjectId (ref: 'user') - The user who created the post.
  - `category`: ObjectId (ref: 'category') - The category to which the post belongs.
  - `comments`: Array of ObjectId (ref: 'comment') - An array of comments associated with the post.
  - `allowComments`: Boolean - A flag indicating whether comments are allowed on the post (default: true).
  - `file`: String - The file path or name associated with the post (default: '').

### User Model

The `User` model represents registered users in the system.

- **Fields:**
  - `firstName`: String (required) - The user's first name.
  - `lastName`: String (required) - The user's last name.
  - `email`: String (required) - The user's email address.
  - `password`: String (required) - The hashed password for user authentication.

## API's

## Register/Login
```
1. Create a new user account: [http://localhost:3000/register](http://localhost:3000/register)
2. Log in: [http://localhost:3000/login](http://localhost:3000/login)
```