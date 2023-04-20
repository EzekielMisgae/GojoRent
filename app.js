const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Routes = require("./routes/Routes");

// express app
const app = express();

// configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/houses");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage, limits: { filesize: 10 * 2048 * 2048 } });

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/GojoAfalagi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// register view engine
app.set("view engine", "ejs");


// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
app.use('/uploads/houses', express.static('uploads/houses'));

app.use(express.json());

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/route', function(req, res) {
  // callback function implementation
});

// routes
app.get("/", (req, res) => {
  res.redirect("/houses");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// house routes
app.use("/houses", Routes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
