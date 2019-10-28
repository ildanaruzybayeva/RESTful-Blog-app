const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer')
const methodOverride = require('method-override');
const app = express();
const port = 3000;

//Connect to DB
connectDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));
app.use(expressSanitizer())

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);


//RESTFUL routes
app.get('/', (req, res) => res.redirect('/blogs'));


//INDEX ROUTE
app.get('/blogs', function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log('error');
    } else {
      res.render('index.ejs', {
        blogs: blogs
      });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
  res.render("new.ejs");
})

//CREATE ROUTE
app.post("/blogs", function (req, res) {
  //create blog

  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs")
    }
  });
});

//SHOW ROUTE 
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {
        blog: foundBlog
      });
    }
  })
})

//EDIT ROUTES
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {
        blog: foundBlog
      });
    }
  })

})

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id)
    }
  })
});

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("blogs/")
    }
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));