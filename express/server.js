const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// MongoDB connection string and database name
const mongoURI = 'mongodb://127.0.0.1:27017';
const dbName = 'library';

// Middleware for parsing JSON requests
app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send("HELLO WORLD!")
})

// Connect to MongoDB
const client =  new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// Search for a book or journal by name
const search = async (query) => {
  try {
    await client.connect().catch(console.error);
    const db = client.db(dbName);
    const booksCollection = db.collection('books');
    const journalsCollection = db.collection('journals');
    const results = {}
    
    results.books = await booksCollection.find({name: {$regex: query, $options: 'i'}}).toArray().then(books => books).catch(error => {
      console.error('Error searching in books:', error);
    })
    results.journals = await journalsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray().then(journals => journals).catch(error => {
      console.error('Error searching in journals:', error);
    })
    return results;
  } catch(e) {
    console.log(e)
  } finally {
    await client.close();
  }
}
app.get('/searchBooks', (req, res) => {
    const query = req.query.searchInput;

    console.log(query);
    search(query).then(
      results => results ? res.render("booksSearch" , {results} ) : res.status(500).json({ error: 'Internal server error' })
    )
  }); 
  app.get('/searchJournals', (req, res) => {
    const query = req.query.searchInput;

    console.log(query);
    search(query).then(
      results => results ? res.render("journalsSearch" , {results} ) : res.status(500).json({ error: 'Internal server error' })
    )
  }); 
  
   // Search for books or journals by publication date
  const searchByDate = async (date) => {
    try {
      await client.connect().catch(console.error);
      const db = client.db(dbName);
      const booksCollection = db.collection('books');
      const journalsCollection = db.collection('journals');
      const results = {}
      
      results.books = await booksCollection.find({ publicationDate: date }).toArray().then(books => books).catch(error => {
        console.error('Error searching in books:', error);
      })
      results.journals = await journalsCollection.find({ publicationDate: date }).toArray().then(journals => journals).catch(error => {
        console.error('Error searching in journals:', error);
      })
      return results;
    } catch(e) {
      console.log(e)
    } finally {
      await client.close();
    }
  }
  app.get('/searchByDateBooks', (req, res) => {
    const date = req.query.dateInput;
    searchByDate(date).then(
      results => { results ? res.render("booksByDate" , {date, results} ) : res.status(500).json({ error: 'Internal server error' })  //res.json(results)
  }) 
  });
  app.get('/searchByDateJournals', (req, res) => {
    const date = req.query.dateInput;
    searchByDate(date).then(
      results => { results ? res.render("journalsByDate" , {date, results} ) : res.status(500).json({ error: 'Internal server error' })  //res.json(results)
  }) 
  });
  
  // Update the name of a book or journal
  app.get('/updateBooks', (req, res) => {
    const currID = req.query.prev;
    const newName = req.query.updateInput;
  
    MongoClient.connect(mongoURI, { useUnifiedTopology: true })
      .then(client => {
        const db = client.db(dbName);
        const collection = db.collection('books');
  
        collection.updateOne({ id: currID }, { $set: { name: newName } }) 
          .then(result => {
            if (result.modifiedCount === 1) {
              //res.json({ message: 'Update successful' });  window.location.href = '/'; // Redirect to homepage or desired page
              const response = ` <script>
                alert('Update successful');
              </script> `;
            res.send(response);
            } else {
              res.status(404).json({ error: 'Entity not found' });
            }
          })
          .catch(error => {
            console.error('Error updating entity:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  app.get('/updateJournals', (req, res) => {
    const currID = req.query.prev;
    const newName = req.query.updateInput;
  
    MongoClient.connect(mongoURI, { useUnifiedTopology: true })
      .then(client => {
        const db = client.db(dbName);
        const collection = db.collection('journals');
  
        collection.updateOne({ id: currID }, { $set: { name: newName } }) 
          .then(result => {
            if (result.modifiedCount === 1) {
              const response = ` <script>
                alert('Update successful');
              </script> `;
            res.send(response);
            } else {
              res.status(404).json({ error: 'Entity not found' });
            }
          })
          .catch(error => {
            console.error('Error updating entity:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  // Generate a report on the list of books and journals
  const report1 = async () => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const booksCollection = db.collection('books');
      const results = {}
      results.books = await booksCollection.aggregate().toArray().catch(console.error)
      return results;
    } catch(e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  app.get('/reportBooks', (req, res) => {
    report1().then(
      results => results ?  res.render("booksReport" , {results} ) : res.status(500).json({ error: 'Internal server error' })
    ) 
  });

  const report2 = async () => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const journalsCollection = db.collection('journals');
      const results = {}
      results.journals = await journalsCollection.aggregate().toArray().catch(console.error)
      return results;
    } catch(e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  app.get('/reportJournals', (req, res) => {
    report2().then(
      results => results ?  res.render("journalsReport" , {results} ) : res.status(500).json({ error: 'Internal server error' })
    ) 
  });
