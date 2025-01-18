const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

// Register a new user

    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            return res.status(404).json({message: "User already exists!"});
            // Add the new user to the users array
          
        } else {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: `User ${username} successfully registered. You can login`});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  let getbooks = new Promise((resolve,reject) => {
    resolve(books)
  });

  return getbooks.then((obj) => res.status(200).json(obj))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  let getbook = new Promise((resolve,reject) => {
    let isbn = req.params.isbn;
    let book = books[isbn];
    resolve(book);
  });

  return getbook.then((obj) => res.status(200).json(obj)); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    let author = req.params.author
    let getbook = new Promise((resolve,reject) => {

        if (author) {
            let book = Object.values(books).filter(book => 
                book.author.toLowerCase() === author.toLowerCase())
    
            if (book.length > 0) {
                resolve(res.status(200).json(book))
            }
            else {
                resolve(res.status(401).json("Author not found"))
            };
        }});
    return getbook.then((obj) => obj) 
     });
    

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title

    let getBookbyTitle = new Promise((resolve,reject) => {

    if (title) {
        let book = Object.values(books).filter(book => 
            book.title.toLowerCase() === title.toLowerCase())
    
        if (book.length > 0) {
            resolve(res.status(200).json(book))
        }
        else{ resolve (res.status(401).json("Title not found"));
        }
    }
});

return getBookbyTitle.then((obj) => obj) 
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  let review = books[isbn].reviews
  if (Object.keys(review).length === 0) {
    return res.status(200).json({message: "Yet no review"});
  }
  else return res.status(200).json(review);
});

module.exports.general = public_users;
