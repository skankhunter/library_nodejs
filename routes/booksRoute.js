const { Router } = require("express");
const path = require("path");
const { Book } = require("../models");
const fileMiddleware = require("../middleware/file");

const router = Router();

const store = {
   books: [],
};

[1, 2, 3].map((el) => {
   const book = new Book(`Title ${el}`, `Description ${el}`);
   store.books.push(book);
});

router.get(`/`, (req, res) => {
   const { books } = store;
   res.json(books);
});

router.get(`/:id`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const book = books.find((book) => book.id === id);

   if (book) {
      res.json(book);
   } else {
      res.status(404).json("Not found");
   }
});

router.get(`/:id/download`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const book = books.find((book) => book.id === id);
   const pathToFile = path.join(__dirname, `../${book.fileBook}`);

   res.download(pathToFile, book.fileName, (err) => {
      if (err) {
         res.status(404).json();
      }
   });
});

router.post(`/`, fileMiddleware.single("book-pdf"), (req, res) => {
   const { books } = store;
   const { title, description } = req.body;

   if (req.file) {
      const { filename, path } = req.file;

      const newBook = new Book(title, description, "", "", "", filename, path);
      books.push(newBook);
      res.status(201).json(newBook);
   } else {
      res.status(404).json();
   }
});

router.put(`/:id`, (req, res) => {
   const { books } = store;
   const { title, description } = req.body;
   const { id } = req.params;
   const bookIndex = books.findIndex((book) => book.id == id);
   
   if (bookIndex !== -1) {
      books[bookIndex] = {
         ...books[bookIndex],
         title,
         description,
      };
      res.json(books[bookIndex]);
   } else {
      res.status(404).json("Not found");
   }
});

router.delete(`/:id`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const bookIndex = books.findIndex((book) => book.id == id);

   if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      res.json("ok");
   } else {
      res.status(404).json("todo | not found");
   }
});

module.exports = router;
