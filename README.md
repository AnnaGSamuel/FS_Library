# FS_Library
This is a Library Management System made using HTML, CSS, Javascript, Node JS for the middle ware and MongoDB Compass as the backend.

It consists of 3 pages - a Home page, a Books page and a Journals page.
The flat files used are books.json and journals.json.

To display the results in a formatted way, EJS framework is used.

The flat files books.json and journals.json are added to collections, books and journals respectively, in database library, in MongoDB Compass.

To start the server, run server.js in the terminal.

On opening home.html, the Welcome page can be viewed. From here, you can navigate to the Books page and Journals page. The Books page and Journals page take you to library.html and library2.html respectively. Here you can search, update, search by publication date and display all records in each section.

# Folder Structure:
The folder express has :
1. server.js
2. views folder

The folder views has :
1. booksByDate.ejs
2. booksReport.ejs
3. booksSearch.ejs
4. journalsByDate.ejs
5. journalsReport.ejs
6. journalsSearch.ejs
