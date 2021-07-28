var express = require('express');
var router = express.Router();

const stripeKey = process.env.STRIPE_KEY;

const Stripe = require('stripe');
const stripe = Stripe(`${stripeKey}`);
const Bike = require('../models/bikes');
const allData = require('../public/javascript/charges');

router.post('/', async (req, res) => {
let basketForStripe = []

Bike.find()
      .then(async (bikes) => {

        let modesLivraison = allData.getModeLivraison(bikes)

        if(req.session.modeLivraisonId == undefined){
            req.session.modeLivraisonId = modesLivraison[0].id
          }
          
        let modeLivraison = modesLivraison[(req.session.modeLivraisonId - 1)]
        let total = allData.calculTotalCommande(bikes, modeLivraison)
        let totalCommande = total.commande
        let totalCharges = total.charges

        for(let i=0; i<bikes.length; i++) {
          basketForStripe[i] = {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: bikes[i].name,
                },
                unit_amount: bikes[i].price*100,
              },
              quantity: bikes[i].quantity,
          } 
        }

        basketForStripe.push({
            price_data: {
            currency: 'eur',
            product_data: {
              name: "Frais de port",
            },
            unit_amount: totalCharges*100,
          },
          quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: basketForStripe,
          mode: 'payment',
          success_url: 'http://localhost:3000/stripe/success',
          cancel_url: 'http://localhost:3000/shop',
        });
        res.json({ id: session.id });
      })


// for(let i=0; i<dataCardBike.length; i++) {
//   basketForStripe[i] = 
//     {
//       price_data: {
//         currency: 'eur',
//         product_data: {
//           name: dataCardBike[i].name,
//         },
//         unit_amount: dataCardBike[i].price*100,
//       },
//       quantity: dataCardBike[i].quantity,
//     } 
// }

//  const session = await stripe.checkout.sessions.create({
//    payment_method_types: ['card'],
//    line_items: basketForStripe,
//    mode: 'payment',
//    success_url: 'http://localhost:3000/stripe/success',
//    cancel_url: 'http://localhost:3000/shop',
//  });

//  res.json({ id: session.id });
});

// Page de confirmation de creation de cmde

 router.get('/success', (req, res) => {
  res.render('success');
 });


 module.exports = router;