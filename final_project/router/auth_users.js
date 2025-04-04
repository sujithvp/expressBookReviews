const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

    let validuser = users.filter((user) => {
        return (user.username === username);
    });
    // Return true if any valid user is found, otherwise false
    if (validuser.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }

}


//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const { isbn } = req.params;
    const review = req.body.review;
    const username = req.user.username; // pulled from the token

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added successfully",
        reviews: books[isbn].reviews
    });
   
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if the user has a review to delete
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user." });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully." });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


