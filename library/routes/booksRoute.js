const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const fileMiddleware = require("../middleware/file");
const Book = require("../models/bookSchema");
const { getFileData } = require("../utils");

const router = Router();

const getViews = async (id) => {
   return await fetch(`http://counter:3000/counter/${id}`).then((data) =>
      data.json()
   );
};

const incrViews = async (id) => {
   await fetch(`http://counter:3000/counter/${id}/incr`, {
      method: "POST",
   });
};

router.get(`/`, async (req, res) => {
   const books = await Book.find();

   res.render("books/index", { books, title: "Books list" });
});

router.get(`/create`, (req, res) => {
   const defaultRenderBook = {
      fileCover: {
         data: "",
         contentType: "",
      },
   };
   res.render("books/create", { book: defaultRenderBook, title: "Creation" });
});

router.get(`/:id`, async (req, res) => {
   const { id } = req.params;

   try {
      const book = await Book.findById(id);
      if (book) {
         const bookCounter = await getViews(id);
         await incrViews(id);
         book.views = bookCounter;

         return res.render("books/view", {
            book,
            title: "Просмотр книги",
         });
      } else {
         return res.redirect("/404");
      }
   } catch {
      console.error(e);
      return res.status(500).json("Ошибка сервиса счетчика");
   }
});

router.get(`/:id/download`, async (req, res) => {
   const { id } = req.params;

   try {
      const book = await Book.findById(id);

      const pathToFile = path.join(__dirname, `../${book.fileBook}`);
      res.download(pathToFile, book.fileName, (err) => {
         if (err) res.redirect(`/404`);
      });
   } catch (e) {
      console.error(e);
      res.redirect(`/404`);
   }
});

router.post(
   `/create`,
   fileMiddleware.fields([
      { name: "imgFiles", maxCount: 1 },
      { name: "booksFiles", maxCount: 1 },
   ]),
   async (req, res) => {
      const { title, description, authors } = req.body;

      try {
         const fileCover = getFileData(req.files, "imgFiles");
         const fileBook = getFileData(req.files, "booksFiles");

         const newBook = new Book({
            title,
            description,
            authors,
            favorite: false,
            fileCover,
            fileName: fileBook.filename,
            fileBook,
         });

         await newBook.save();
         res.redirect("/books");
      } catch (e) {
         console.log(e);
         res.redirect(`/error/404`);
      }
   }
);

router.get("/update/:id", async (req, res) => {
   const { id } = req.params;

   try {
      const book = await Book.findById(id);
      return book
         ? res.render("books/update", {
              title: "Book | view",
              book,
           })
         : res.redirect("/404");
   } catch (e) {
      console.error(e);
      res.status(404).redirect("/404");
   }
});

router.post(
   `/update/:id`,
   fileMiddleware.fields([
      { name: "imgFiles", maxCount: 1 },
      { name: "booksFiles", maxCount: 1 },
   ]),
   async (req, res) => {
      const { title, description, authors } = req.body;
      const { id } = req.params;

      try {
         const fileCover = getFileData(req.files, "imgFiles");
         const fileBook = getFileData(req.files, "booksFiles");

         await Book.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            fileCover,
            fileName: fileBook.filename,
            fileBook,
         });

         res.redirect(`/books/${id}`);
      } catch (e) {
         console.error(e);
         res.status(404).redirect("/404");
      }
   }
);

router.post(`/delete/:id`, async (req, res) => {
   const { id } = req.params;

   try {
      await Book.deleteOne({ _id: id });
      res.redirect(`/books`);
   } catch (e) {
      console.log(e);
      res.redirect(`/404`);
   }
});

module.exports = router;
