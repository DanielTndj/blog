const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config({ path: __dirname + "/.env" });

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihu46.mongodb.net/blogDB?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) =>
    err ? console.log(err) : console.log("Succesfully running mongodb...")
);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please fill the title field"],
  },
  post: {
    type: String,
    required: [true, "Please fill the post field"],
  },
});

const PostModel = mongoose.model("Post", postSchema);

const homeStartingContent = "Welcome to my blog";
const aboutContent = "My name is Daniel.";
const contactContent = "Email: Daniel Tanudjaja";

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  PostModel.find({}, (err, result) => {
    console.log(result);
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        listPost: result,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new PostModel({
    title: _.lowerCase(req.body.title),
    post: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:title", (req, res) => {
  const title = _.lowerCase(req.params.title);

  PostModel.findOne({ title: title }, (err, result) => {
    if (result) {
      res.render("post", { post: result });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/delete-post", (req, res) => {
  PostModel.deleteOne({ title: req.body.button }, (err) => {
    err ? console.log(err) : console.log("Succesfully deleted a post");

    res.redirect("/");
  });
});

app.listen(3000 || process.env.PORT, function () {
  console.log("Server started on port 3000");
});
