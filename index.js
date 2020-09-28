const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const password = 'HMRhwq6jA36DVM5';

const uri = "mongodb+srv://ArifulIslam:HMRhwq6jA36DVM5@cluster0.lmoae.mongodb.net/tasks?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

client.connect(err => {
  const todoCollection = client.db("tasks").collection("todos");

  app.get('/todos', (req, res) => {
    todoCollection.find({}).limit(10)
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/todo/:id', (req, res) => {
    todoCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/addTodo', (req, res) => {
    const todo = req.body;
    todoCollection.insertOne(todo)
    .then(result => {
        console.log('data added successfully');
        res.redirect('/')
    })
  })

  app.patch('/update/:id', (req, res) => {
    todoCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {todoName:req.body.todoName, type:req.body.type}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    todoCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
});



app.listen(3000)

