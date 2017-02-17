var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var User = require("./models/User.js");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// var Saved = require("./models/Saved.js");

var request = require("request");
var cheerio = require("cheerio");
var Promise = require("bluebird");

mongoose.Promise = Promise;

var exphbs = require("express-handlebars");
// Initialize Express

var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
//  mongodb://heroku_q343w7gr:mcm1vui9g2kva2oohbvag3sfrp@ds153179.mlab.com:53179/heroku_q343w7gr
mongoose.connect("mongodb://heroku_q343w7gr:mcm1vui9g2kva2oohbvag3sfrp@ds153179.mlab.com:53179/heroku_q343w7gr");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});
var exampleUser = new User({
    name: "Stevie Wonder"
});
// Using the save method in mongoose, we create our example user in the db
exampleUser.save(function (error, doc) {
    // Log any errors
    if (error) {
        console.log(error);
    }
    // Or log the doc
    else {
        console.log(doc);
    }
});

app.get("/", function (req, res) {
    res.redirect("/articles");
});

app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    request("https://news.google.com/", function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $('.esc-lead-article-title').each(function (i, element) {
            var result = {};
            for (var i = 0; i < 3; i++) {

                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");
            }
            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });

        });
    });
    // Tell the browser that we finished scraping the text
    res.redirect("/")
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function (error, found) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            console.log(found)
            res.render("added", { object: found })
        }
    });
});

app.post("/submit/:id", function (req, res) {
    // console.log(req.body)

    console.log(req.params.id)

    Article.findOneAndUpdate(
        {
            _id: req.params.id
        },
        { $set: { saved: true } 
        
    },



        function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
        }
    )
})

app.get("/saved", function (req, res) {
    console.log("INIT TO WINIT")
    var a =2;
    var b =2;
    console.log(a +b)
     Article.find({saved:true}, function (error, found) {
        // Log any errors
        if (error) {
           res.send(error);
        }
        // Or send the doc to the browser as a json object
        else {
            console.log(found);
            res.render("saved", {object: found});
        }
    });
   

});


app.post("/notes/:id", function (req, res) {

    var note = new Note(result);

    note.save(function (err, note) {

        if (err) {
            console.log(err);
        }

        else {
            console.log(note);
        }
    });

});

app.post("/unsave/:id", function (req, res) {
    // console.log(req.body)

    console.log(req.params.id)

    Article.findOneAndUpdate(
        {
            _id: req.params.id
        },
        { $set: { saved: false } 
        
    },



        function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
        }
    )
})



app.get("/empty", (req, res) => {
    Article.remove({}, function (err, removed) {

    });
    res.redirect("/articles")
});

// Listen on port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("App running on port 3000!");
});