// Import the data model and all required libaries
var express = require('express');
var app = express();
var mongoose = require('mongoose')
const Data = require("./noteModel");
const assert = require("assert");

// Connect to the database
mongoose.connect("mongodb://localhost/NoteApp");
// Tell us whether is connection was successful or not
mongoose.connection.once("open", () => {
    console.log("Connected!");
}).on("error", function(error) {
    console.log("Connection Error:", error);
});

// When localhost:8081/fetch is pinged return all items in the Data collection
app.get('/fetch', (req, res) => {
    Data.find({}).then((notes) => { // return all items in the datas collection
        res.send(notes)
    });
});

// When the delete route is called seach the database using the ID header and delete that item
app.post('/delete', (req, res) => {
    Data.findOneAndRemove({
        _id: req.get("id")
    }, function(err) {});
    res.send("Done")
})

// To update, look for the item with the given ID and update all the vakues with the new header values
app.post('/update', (req, res) => {
    Data.update({
        _id: req.get("id")
    }, {
        date: req.get("date"),
        title: req.get("title"),
        note: req.get("note")
    }, {
        upsert: true
    }, (err) => {})
    res.send("Done")
});

// Create a new data object with the headers and input it into the DB
app.post("/form", (req, res) => {
    var data = new Data({ note: req.get("note"), title: req.get("title"), date: req.get("date") })
    res.send("Done")
    data.save().then(() => {
        assert(data.isNew == false);
    });
    console.log("Saved");
})

// Start the server on localhost:8081
var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});