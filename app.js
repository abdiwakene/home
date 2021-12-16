// init project
const express = require("express"); // the library we will use to handle requests
const mongodb = require("mongodb"); // load mongodb
const urls = require("url");

const port = process.env.port || 8080; // port to listen on

const app = express(); // instantiate express
app.use(express.static('./public'))


const uri = "mongodb+srv://abdi:cs20password@cluster0.nhrgx.mongodb.net/companies?retryWrites=true&w=majority"; // put your URI HERE


mongodb.MongoClient.connect(uri, (err, db) => {
  // connect to our database
  const dbo = db.db("lendinglibrary");
  const collection = dbo.collection("textbooks");

  // Responds to GET requests with the route parameter being the form.
  app.get("/:request", (req, res) => {
    var qobj = urls.parse(req.url, true).query
    var querys;

    if (qobj.name != '') {
        //name query 
        querys = {'name' : qobj.name};
    } else if (qobj.topic != '') {
        //topic query
        querys = {'topic': qobj.topic};
    } else if (qobj.isbn != '') {
        //isbn query
        querys = {'isbn': qobj.isbn};
    }

    // search the database (collection) for all users with the `user` field being the `user` route paramter
    collection.find(querys).toArray(async (err, docs) => {
      if (err) {
        // if an error happens
        res.send("Error in GET req.");
      } else {
        // if all works
        var results = "";
        results += "Request" + "\n\n" + "Name: " + qobj.firstName + " " + qobj.lastName + "\n" + "Student ID: " + qobj.idNum + "\n" + "Student Email: " + qobj.email + "\n\n"; 
        await docs.forEach(function(item){
            if (item.available === "Yes"){
                results += "Book Title: " + item.name + "\n" + "Book Topic: " + item.topic + "\n" + "Book ISBN: " + item.isbn + "\n\n" + "This textbook is available. Please stop by the FIRST Center when ready for pick up. Thank you." + "\n";
            } else {
                results += "Book Title: " + item.name + "\n" + "Book Topic: " + item.topic + "\n" + "Book ISBN: " + item.isbn + "\n\n" + "Unfortunatly, this textbook is not available at the moment.\nPlease check again at another time, or stop by the FIRST Center to place a hold for when next copy is available. Thank you." + "\n\n";
            }
        });
        if (docs.length === 0) {
          results = "There are no results matching your search. Please try again.";
        }
        res.end(results);
      }
    });
  });
  
  app.post("/:request", (req, res) => {
      console.log(req);
  });

  // listen for requests
  var listener = app.listen(port, () => {
    console.log("This app is listening on port " + listener.address().port);
  });
});