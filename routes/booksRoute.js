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
   res.render("books/index", { books, title: "Books list" });
});

router.get(`/create`, (req, res) => {
   res.render("books/create", { book: {}, title: "Creation" });
});

router.get(`/:id`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const book = books.find((book) => book.id === id);

   return book
      ? res.render("books/view", { book, title: "Просмотр книги" })
      : res.redirect("/404");
});

router.get(`/:id/download`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const book = books.find((book) => book.id === id);
   const pathToFile = path.join(__dirname, `../${book.fileBook}`);

   res.download(pathToFile, book.fileName, (err) => {
      if (err) {
         res.status(404).redirect(`/404`);
      }
   });
});

router.post(`/create`, fileMiddleware.single("book-pdf"), (req, res) => {
   const { books } = store;
   const { title, description, authors } = req.body;

   const newBook = new Book(
      title,
      description,
      authors,
      "",
      "",
      "filename",
      path
   );
   books.push(newBook);
   res.redirect("/books");

   // if (req.file) {
   //    const { filename, path } = req.file;

   //    const newBook = new Book(title, description, "", "", "", filename, path);
   //    books.push(newBook);
   //    res.status(201).redirect("books/index", { books });
   // } else {
   //    res.status(404).redirect(`/error/404`);
   // }
});

router.get("/update/:id", (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const bookIndex = books.findIndex((book) => book.id == id);

   if (bookIndex !== -1) {
      res.render("books/update", {
         title: "Book | view",
         book: books[bookIndex],
      });
   } else {
      res.status(404).redirect("/404");
   }
});

router.post(`/update/:id`, (req, res) => {
   const { books } = store;
   const { title, description, authors } = req.body;
   const { id } = req.params;
   const bookIndex = books.findIndex((book) => book.id == id);

   if (bookIndex !== -1) {
      books[bookIndex] = {
         ...books[bookIndex],
         title,
         description,
         authors,
      };
      res.redirect(`/books/${id}`);
   } else {
      res.status(404).redirect(`/404`);
   }
});

router.post(`/delete/:id`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const bookIndex = books.findIndex((book) => book.id == id);

   if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      res.redirect(`/books`);
   } else {
      res.status(404).redirect(`/404`);
   }
});

module.exports = router;
