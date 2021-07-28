const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
   url: { type: String, required: true },
   price: { type: Number, required: true },
   mea: { type: Boolean },
   modeLiv: { type: Array },
   quantity: { type: Number}
 
});

module.exports = mongoose.model('products', productSchema);
