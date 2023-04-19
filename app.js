//jshint esversion:6
const dotent = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Initial content for blog website pages
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Initailize express as app
const app = express();

//set ejs as view engine
app.set('view engine', 'ejs');

//use body parser for url encoding
app.use(bodyParser.urlencoded({ extended: true }));
//use static folder public
app.use(express.static("public"));

//connect to mongodb databse server and create todolistDB
const localUrl = "mongodb://localhost:27017/blogDB";
const cloudUrl = process.env.DBURL;
mongoose.connect(cloudUrl);

//Schema for posts
const postSchema = {
  title: String,
  content: String
};

//mongoose model for postSchema
const Post = mongoose.model("Post", postSchema);

//serve home page when client request method on route "/"
app.get("/", function (req, res) {
  //find all the posts from database
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

//serve about page when client request method on route "/about"
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

//serve contact page when client request method on route "/contact"
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

//serve post compose page when client request method on route "/compose"
app.get("/compose", function (req, res) {
  res.render("compose");
});

//redirect to home page when client request post method from compose page "/compose"
app.post("/compose", function (req, res) {
  //create document for posts collection
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //save document to the databse
  post.save(function (err) {
    //if post successfully saved and no error found
    if (!err) {
      //redirect requested client to home page
      res.redirect("/");
    }
  });
});

//serve post page when specific post requested by client
app.get("/posts/:postId", function (req, res) {
  //get requested postid from url
  const requestedPostId = req.params.postId;
  //find requested post from database by postId
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if(!err && post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      res.redirect("/");
    }
  });
});


//listen for client on port 3000 or host server port
let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on port ", port);
});
