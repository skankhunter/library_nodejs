# library_nodejs

https://library-nodejs-hm.herokuapp.com/books

# ДЗ  по работе с mongoDB

> запрос(ы) для вставки данных минимум о двух книгах в коллекцию books

    db.books.insertMany([
        {book1},
        {book2},
        {book3}
    ])

> запрос для поиска полей документов коллекции books по полю title
    
    db.books.find({title: "title"})

> запрос для редактирования полей: description и authors коллекции books по _id записи

    db.inventory.updateOne(
   { _id: id },
   {
     $set: { description: "description", authors: authors },
   }
)
