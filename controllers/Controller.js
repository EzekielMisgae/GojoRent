const House = require('../models/house');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/houses/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
  // Add transformFile function to resize and crop the image
  transformFile: function (req, file, cb) {
    sharp(file.path)
      .resize(800, 600) // Set the desired width and height here
      .toFormat('jpeg')
      .toBuffer(function (err, buffer) {
        if (err) {
          return cb(err);
        }
        cb(null, buffer);
      });
  },
});

// Initialize upload for multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('houseImage', 3);
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Display list of all Houses
exports.index = async function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    const count = await House.countDocuments();
    const houses = await House.find()
      .skip(skip)
      .limit(limit)
      .exec();
    res.render('index', { title: 'House List', houses: houses, count: count, currentPage: page, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    console.log(err);
  }
};


// Display House create form on GET
exports.house_upload_get = function (req, res) {
  res.render('create', { title: 'Upload House' });
};

// Handle House create on POST
exports.house_upload_post = function (req, res, next) {
  // Call upload function to handle image uploads
  upload(req, res, function (err) {
    if (err) {
      return next(err);
    } else {
      const house = new House({
        title: req.body.title,
        housePrice: req.body.housePrice,
        houseType: req.body.houseType,
        houseAddress: req.body.houseAddress,
        houseCity: req.body.houseCity,
        phone: req.body.phone,
        houseTag: req.body.houseTag,
        houseDescription: req.body.body,
        houseImages: req.files.map((file) => file.filename),
      });
      house.save(function (err) {
        if (err) {
          return next(err);
        } else {
          res.redirect(house.url);
        }
      });
    }
  });
};


// Display House delete form on GET
exports.house_delete_get = function (req, res) {
  House.findById(req.params.id, function (err, house) {
    if (err) {
      console.log(err);
    } else {
      res.render('house_delete', { title: 'Delete House', house: house });
    }
  });
};


// Display detail page for a specific House
exports.house_details = function (req, res, next) {
  House.findById(req.params.id, function (err, house) {
    if (err) {
      return next(err);
    } else {
      res.render('details', { title: 'House Details', house: house });
    }
  });
};


// Handle House delete on POST
exports.house_delete_post = function (req, res) {
  House.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.redirect('details');
    } else {
      res.redirect('houses');
    }
  });
};