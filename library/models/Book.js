const {generateUniqueId} = require('node-unique-id-generator');

class Book {
    constructor(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    ) {
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
        this.id = generateUniqueId();
    }
}

module.exports = Book;
