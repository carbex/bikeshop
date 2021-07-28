const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  url: { type: String, required: true },
  quantity: { type: Number, required: true },
  modeLiv: { type: Array}
});

module.exports = mongoose.model('bikes', bikeSchema);
