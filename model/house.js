const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  housePrice: {
    type: String,
    required: true,
  },
  houseType: {
    type: String,
    required: true,
  },
  houseAddress: {
    type: String,
    required: true,
  },
  houseCity: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  houseTag: {
    type: String,
    required: true,
  },
  houseDescription: {
    type: String,
    required: true
  },
  houseImages: [{
    type: String
  }],
}, { timestamps: true });

houseSchema.virtual('url').get(function () {
  return '/houses/' + this._id;
});

const House = mongoose.model('House', houseSchema);
module.exports = House;