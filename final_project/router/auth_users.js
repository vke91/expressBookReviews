const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let validUsers = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
        }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
}};

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
    let user = req.session.authorization.username;
    let isbn = req.params.isbn;
    let reviews = books[isbn].reviews;
    let review = req.body.review;
    if (review && isbn) {
        reviews[user] = review;
        return res.status(200).json("review added");
    }
    else {
        return res.status(401).json("Cannot add review")
    };
});


// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let user = req.session.authorization.username;
    let isbn = req.params.isbn;
    let reviews = books[isbn].reviews
    delete reviews[user]
     
    return res.status(200).json("Your review was deleted");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
