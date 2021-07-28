let express = require('express');
let router = express.Router();

const shopController = require('../controllers/shop');
const Bike = require('../models/bikes');
const Product = require('../models/products');
const allData = require('../public/javascript/charges');


///////////////////////
// AFFICHE LE BASKET //
///////////////////////

// router.get('/', shopController.displayShop)


////////////////////////////////////////////////////////////
// AJOUTE UN PRODUIT AU BASKET ET REDIRIGE VERS LE BASKET //
////////////////////////////////////////////////////////////

// router.get('/get-product', shopController.getProduct);


//////////////////////////////////////////////////////////////
// SUPPRIME UN PRODUIT DU BASKET ET REDIRIGE VERS LE BASKET //
//////////////////////////////////////////////////////////////

// router.get('/delete-product', shopController.deleteProduct)


////////////////////////////////////////////////////////////////
// MAJ DE LA QTE DE CHAQUE PRODUIT ET REDIRIGE VERS LE BASKET //
////////////////////////////////////////////////////////////////

// router.post('/update-product', shopController.updateProduct)


/////////////////////
// ROUTEUR MONGODB //
/////////////////////

// On utilise le modèle Bike pour interroger la bdd et récupérer tous les bikes

router.get('/', async (req, res, next) => {
    
    try {
        const bikes = await Bike.find()
        const products = await Product.find()
        let modesLivraison = allData.getModeLivraison(bikes)

        if(req.session.modeLivraisonId == undefined){
            req.session.modeLivraisonId = modesLivraison[0].id
          }
        let modeLivraison = modesLivraison[(req.session.modeLivraisonId - 1)]

        let total = allData.calculTotalCommande(bikes, modeLivraison)
        
        let totalCommande = total.commande
        let totalCharges = total.charges
        res.render('shop', {dataCardBike:bikes, totalCharges, totalCommande, modesLivraison, modeLivraison, products})
    } 
    catch (error) {
        console.log(error)    } 
});

// Création d'une instance bike du modèle Bike pour envoyer à la bdd les proriétés récupérées par la req http

router.get('/get-product/', async(req, res, next) => {

    try {
        const bike = await Bike.findOne({ name: req.query.name })
        const product = await Product.findOne({ name: req.query.name })

        if (!bike) {
            const newBike = new Bike({
                ...req.query
            });
            try {
                await newBike.save()
                let quantityProduct = product.quantity - 1 
                await Product.updateOne({ name: req.query.name }, { quantity: quantityProduct})
                res.redirect('/');
            } 
            catch (error) {
                console.log(error)
            }
        }       
        try {
            let quantityProduct = product.quantity - 1
            await Product.updateOne({ name: req.query.name }, { quantity: quantityProduct})
            let quantityBike = bike.quantity + 1;
            await Bike.updateOne({ name: req.query.name }, { quantity: quantityBike })
            res.redirect('/');
        } 
        catch (error) {
            console.log(error)        }
    }
    catch (error) {
        console.log(error)    }
    
    

    // Bike.findOne({ name: req.query.name })
    //     .then(bike => {
    //         if (!bike) {
    //             const bike = new Bike({
    //                 ...req.query
    //             });
    //             bike.save()
    //                 .then(() => {
    //                     res.redirect('/shop');
    //                     res.status(201).json({ message: 'Objet enregistré !'})
    //                 })
    //                 .catch(error => res.status(400).json({ error }))  
    //         }
    //         let qte = bike.quantity + 1;
    //         Bike.updateOne({ name: req.query.name }, { quantity: qte })
    //             .then(() => {
    //                 res.redirect('/shop');
    //                 res.status(201).json({ message: 'Quantité mise à jour !'})
    //             })
    //             .catch(error => res.status(400).json({ error }))
    //     })
    //     .catch(error => res.status(500).json({ error })) 
           
});

// Suppression du document de la bdd dont la clef name = req.query.name

router.get('/delete-product', async (req, res, next) => {
    try {
        let bike = await Bike.findOne({ name: req.query.name })
        let quantityBikeBeforUpdate = bike.quantity
        await Bike.deleteOne({ name: req.query.name })
        const product = await Product.findOne({ name: req.query.name })
        let quantityProduct = product.quantity + quantityBikeBeforUpdate
        await Product.updateOne({ name: req.query.name }, { quantity: quantityProduct})
        res.redirect('/shop')
    } 
    catch (error) {
        console.log(error)    
    }

    // Bike.deleteOne({ name: req.query.name })
    //   .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    //   .catch(error => res.status(400).json({ error }));
    // res.redirect('/shop')
});

// Maj de la quantité du produit dans la bdd

router.post('/update-product', async (req, res, next) => {
    try {
        
        const bike = await Bike.findOne({ name: req.body.name })
        let quantityBikeBeforUpdate = bike.quantity
        const product = await Product.findOne({ name: req.body.name })
        let quantityProduc = product.quantity
        if(req.body.quantity <= quantityProduc) {
            let diff = quantityBikeBeforUpdate - req.body.quantity
            await Bike.updateOne({ name: req.body.name }, { quantity: req.body.quantity })  
            let quantityProductUpdated = quantityProduc + diff
            await Product.updateOne({ name: req.body.name }, { quantity: quantityProductUpdated})
            res.redirect('/shop')
        }
        res.redirect('/shop')
        
    } 
    catch (error) {
        console.log(error)    
    }

    // Bike.updateOne({ name: req.body.name }, { quantity: req.body.quantity })
    //   .then(() => res.status(201).json({ message: 'Qté mise à jour !'}))
    //   .catch(error => res.status(400).json({ error }));
    // res.redirect('/shop')
});

router.post('/update-charges', (req, res, next) => {
    req.session.modeLivraisonId = req.body.modeLivraisonId
    res.redirect('/shop')
})


module.exports = router;
