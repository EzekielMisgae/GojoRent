const express = require("express");
const connectDB = require("./db");
const multer = require("multer");
const path = require('path');
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const Routes = require("./Auth/route.js");

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");

connectDB();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./Auth/route"));

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });
app.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files;
    const images = [];

    for (const file of files) {
      const image = new Image({
        filename: file.filename
      });
      await image.save();
      images.push(image);
    }

    res.redirect('/index');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.render('images', { images });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Serve static files from the "public" and "uploads" directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/houses');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// house routes
app.use('/houses', Routes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

const server = app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
