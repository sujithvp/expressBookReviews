const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(404).json({message: "username and password must have value"})

    }

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulate async operation (e.g., fetching from DB in future)
      const getBooks = async () => {
        return books;
      };
  
      const allBooks = await getBooks();
  
      res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
  });



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // Simulate an async operation (like DB or API call)
    const getBookByISBN = async (isbn) => {
      return books[isbn];
    };

    const book = await getBookByISBN(isbn);

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found for ISBN " + isbn });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
  
      // Simulate an async operation (like DB or API call)
      const getBooksByAuthor = async (author) => {
        // Filter books by author
        return Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      };
  
      const filteredBooks = await getBooksByAuthor(author);
  
      if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found for this author." });
      }
  
      res.status(200).json(filteredBooks);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
  
      // Simulate an async operation (like DB or API call)
      const getBooksByTitle = async (title) => {
        return Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
      };
  
      const filteredBooks = await getBooksByTitle(title);
  
      if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found with this title." });
      }
  
      res.status(200).json(filteredBooks);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 //return res.status(300).json({message: "Yet to be implemented"});

 const isbn = req.params.isbn;

 if (!books[isbn]) {
     return res.status(404).json({ message: "Book not found." });
 }

 const reviews = books[isbn].reviews;

 if (Object.keys(reviews).length === 0) {
     return res.json({ message: "No reviews available for this book." });
 }

    res.send(reviews);

});

module.exports.general = public_users;
