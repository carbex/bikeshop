var express = require('express');
var router = express.Router();

var dataBike = [
  {name:"BIK045", url:"/images/bike-1.jpg", price:679},
  {name:"ZOOK07", url:"/images/bike-2.jpg", price:999},
  {name:"TITANS", url:"/images/bike-3.jpg", price:799},
  {name:"CEWO", url:"/images/bike-4.jpg", price:1300},
  {name:"AMIG039", url:"/images/bike-5.jpg", price:479},
  {name:"LIK099", url:"/images/bike-6.jpg", price:869},
]

// Route stripe module de paiemement en ligne

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51IbjhSEifScnyKE5pzhtLh5oKWz1dqG41lJYPdEKrsNYAB74hzU67CKj6REh1rz0wk3u44zp4uRq8ADsMkP549Az00kjnjWbP3');

router.post('/create-checkout-session', async (req, res) => {
let basketForStripe = []

for(let i=0; i<req.session.dataCardBike.length; i++) {
  basketForStripe[i] = 
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: req.session.dataCardBike[i].name,
        },
        unit_amount: req.session.dataCardBike[i].price*100,
      },
      quantity: req.session.dataCardBike[i].quantity,
    } 
}

 const session = await stripe.checkout.sessions.create({
   payment_method_types: ['card'],
   line_items: basketForStripe,
   mode: 'payment',
   success_url: 'https://bikeshop-alex-04-2021.herokuapp.com/success',
   cancel_url: 'https://bikeshop-alex-04-2021.herokuapp.com/cancel',
 });

 res.json({ id: session.id });
});

// Page de confirmation de creation de cmde

 router.get('/success', (req, res) => {
  res.render('success');
 });

// Page de confirmation de l’annulation

 router.get('/cancel', (req, res) => {
  res.render('index', {dataBike:dataBike});
 });


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = []
  }
  
  res.render('index', {dataBike:dataBike});
});

router.get('/shop', function(req, res, next) {

  var alreadyExist = false;

  for(var i = 0; i< req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].name == req.query.bikeNameFromFront){
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
      alreadyExist = true;
    }
  }

  if(alreadyExist == false){
    req.session.dataCardBike.push({
      name: req.query.bikeNameFromFront,
      url: req.query.bikeImageFromFront,
      price: req.query.bikePriceFromFront,
      quantity: 1
    })
  }


  res.render('shop', {dataCardBike:req.session.dataCardBike});
});

router.get('/delete-shop', function(req, res, next){
  
  req.session.dataCardBike.splice(req.query.position,1)

  res.render('shop',{dataCardBike:req.session.dataCardBike})
})

router.post('/update-shop', function(req, res, next){
  
  var position = req.body.position;
  var newQuantity = req.body.quantity;

  req.session.dataCardBike[position].quantity = newQuantity;

  res.render('shop',{dataCardBike:req.session.dataCardBike})
})

module.exports = router;
