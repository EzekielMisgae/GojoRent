const Mongoose = require("mongoose");

const connectDB = async () => {
  await Mongoose.connect('mongodb://localhost:27017/GojoAfalagi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
};
module.exports = connectDB;
