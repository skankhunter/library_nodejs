const {generateUniqueId} = require('node-unique-id-generator');

class Book {
    constructor(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    ) {
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.id = generateUniqueId();
    }
}

module.exports = Book;
