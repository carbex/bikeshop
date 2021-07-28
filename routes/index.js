let express = require('express');
const bikes = require('../models/bikes');
let router = express.Router();

const Product = require('../models/products');
const Bike = require('../models/bikes');

// let dataBike = [
//   {name:"BIK045", url:"/images/bike-1.jpg", price:679, mea: false, modeLiv:["1", "2"], quantity: 10},
//   {name:"ZOOK07", url:"/images/bike-2.jpg", price:999, mea: false, modeLiv:["1", "3"], quantity: 13},
//   {name:"TITANS", url:"/images/bike-3.jpg", price:799, mea: false, modeLiv:["1", "2", "3"], quantity: 2},
//   {name:"CEWO", url:"/images/bike-4.jpg", price:1300, mea: false, modeLiv:["1", "2", "3"], quantity: 34},
//   {name:"AMIG039", url:"/images/bike-5.jpg", price:479, mea: false, modeLiv:["1", "2", "3"], quantity: 5},
//   {name:"LIK099", url:"/images/bike-6.jpg", price:869, mea: false, modeLiv:["1", "2"], quantity: 0},
// ]

// let cheaperBikes = []

// dataBike.sort(function compare(a, b) {
//   if (a.price < b.price)
//      return -1;
//   if (a.price > b.price )
//      return 1;
//   return 0;
// });
// cheaperBikes = [dataBike[0], dataBike[1], dataBike[2]]


// router.get('/initialize', async (req, res, next) => {
//   for(let i=0; i<dataBike.length; i++) {
//     const newProduct = new Product(dataBike[i])
//     await newProduct.save()
//   }
//   res.redirect('/')
// });

/* GET home page. */
router.get('/', async (req, res, _next) => {

  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = []
  }

  const products = await Product.find()
  // const cheaperProducts = await Product.find().sort({ price: 1}).limit(3)
  // const cheaperProductsName = cheaperProducts.map(cheaperProduct => cheaperProduct.name)
  const limitOfCheaperProductsToDisplay = 3
  const cheaperProductsName = await (await Product.find().sort({ price: 1}).limit(limitOfCheaperProductsToDisplay)).map(cheaperProduct => cheaperProduct.name)
  await Product.updateMany({ name: cheaperProductsName }, { $set: {mea: true} })
  await Product.updateMany({ name: { $nin: cheaperProductsName } }, { $set: {mea: false} })
  const bikes = await Bike.find()

  req.session.count = 0
  if(bikes) {
    for(let i=0; i<bikes.length; i++) {
      req.session.count += bikes[i].quantity
    }
  }

  // let cheaperBikes = []

  // products.sort(function compare(a, b) {
  //   if (a.price < b.price)
  //     return -1;
  //   if (a.price > b.price )
  //     return 1;
  //   return 0;
  // });
  // cheaperBikes = [products[0], products[1], products[2]]

  res.render('index', {dataBike: products, count: req.session.count});
});


module.exports = router;
