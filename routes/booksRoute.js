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

router.post(
   `/create`,
   fileMiddleware.fields([
      { name: "image-cover", maxCount: 1 },
      { name: "book-pdf", maxCount: 1 },
   ]),
   (req, res) => {
      const { books } = store;
      const { title, description, authors } = req.body;

      if (req.files) {
         const imgCover =
            req.files["image-cover"] && req.files["image-cover"][0];
         const bookPdf = req.files["book-pdf"] && req.files["book-pdf"][0];

         const newBook = new Book(
            title,
            description,
            authors,
            "",
            imgCover && imgCover.path,
            bookPdf && bookPdf.filename,
            bookPdf && bookPdf.path
         );

         books.push(newBook);
         res.redirect("/books");
      } else {
         res.redirect(`/error/404`);
      }
   }
);

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
      res.redirect("/404");
   }
});

router.post(
   `/update/:id`,
   fileMiddleware.fields([
      { name: "image-cover", maxCount: 1 },
      { name: "book-pdf", maxCount: 1 },
   ]),
   (req, res) => {
      const { books } = store;
      const { title, description, authors } = req.body;
      const { id } = req.params;
      const bookIndex = books.findIndex((book) => book.id == id);

      if (bookIndex !== -1 && req.files) {
         const imgCover = req.files["image-cover"] && req.files["image-cover"][0];
         const bookPdf = req.files["book-pdf"] && req.files["book-pdf"][0];

         books[bookIndex] = {
            ...books[bookIndex],
            title,
            description,
            authors,
            fileCover: imgCover && imgCover.path,
            fileName: bookPdf && bookPdf.filename,
            fileBook: bookPdf && bookPdf.path,
         };

         res.redirect(`/books/${id}`);

      } else {
         res.redirect(`/error/404`);
      }
   }
);

router.post(`/delete/:id`, (req, res) => {
   const { books } = store;
   const { id } = req.params;
   const bookIndex = books.findIndex((book) => book.id == id);

   if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      res.redirect(`/books`);
   } else {
      res.redirect(`/404`);
   }
});

module.exports = router;
