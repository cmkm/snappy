

var express = require('express'),

app = express();

var mongoDB = null;


// Currently pulling data from the database with every API call.
//
// Will need to implement caching later on.
//
app.get('/serviceCategories', function(req, res) {
    mongoDB.collection('serviceCategory').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/serviceCategories/:id', function(req, res) {
    mongoDB.collection('serviceCategory').findOne({ id: req.params.id }, function (err, item) {
        res.json(item);
    });
});

app.get('/services', function(req, res) {
    mongoDB.collection('service').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/services/:catId', function(req, res) {
    mongoDB.collection('service').find({ catId: req.params.catId }).toArray(function (err, items) {
        res.json(items);
    });
});

app.use("/public", express.static(__dirname + "/public"));

app.listen(3000);

console.log('Express listening on port 3000');

// Establish mongoDB connection
var mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://localhost:27017/snappy-vm', function(err, db) {
    if(!err) {
        console.log("MongoDB Connected!");
        
        mongoDB = db;
        
        //db.collection('serviceCategory').insert({ id: 'db', name: 'Database', multi: false }, function(err, result){console.log(err);});
        
        //db.collection('service').insert({ id: 'ssh', name: 'Remote SSH', catId: 'other' }, function(err, result){console.log(err);});
        
        
    }
    else {
        console.log("MongoDB Fail :(");
        console.log(err);
    }

});


