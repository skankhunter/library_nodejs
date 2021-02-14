const express = require('express');
const cors = require('cors');
const formData = require("express-form-data");

const {Book} = require('./models');
const {API} = require('./constants');

const store = {
    books: [],
};

[1, 2, 3].map(el => {
    const book = new Book(`Title ${el}`, `Description ${el}`);
    store.books.push(book);
});

const app = express();

app.use(formData.parse());
app.use(cors());

app.get(`${API}/user/login`, (req, res) => {
    res
        .status(201)
        .json({ id: 1, mail: "test@mail.ru" });
});

app.get(`${API}/books`, (req, res) => {
    const {books} = store;
    res.json(books);
});

app.get(`${API}/books/:id`, (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const book = books.find(book => book.id === id);

    if (book) {
        res.json(book);
    } else {
        res
            .status(404)
            .json("Not found");
    }
});

app.post(`${API}/books`, (req, res) => {
    const {books} = store;
    const {title, description} = req.body;

    const newBook = new Book(title, description);
    books.push(newBook);

    res
        .status(201)
        .json(newBook);
});

app.put(`${API}/books/:id`, (req, res) => {
    const {books} = store;
    const {title, description} = req.body;
    const {id} = req.params;
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            title,
            description,
        };
        res.json(books[bookIndex]);
    } else {
        res
            .status(404)
            .json("Not found");
    }
});

app.delete(`${API}/books/:id`, (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        res.json('ok');
    } else {
        res
            .status(404)
            .json("todo | not found");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
