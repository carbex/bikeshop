// LES CONTROLEURS PERMETTENT DE SEPARER LA LOGIQUE METIER DES ROUTES !!!

exports.displayShop = (req, res, next) => {
    if(req.session.dataCardBike == undefined){
        req.session.dataCardBike = []
      }
    res.render('shop', {dataCardBike:req.session.dataCardBike});
}

exports.getProduct = (req, res, next) => {
    var alreadyExist = false;

  for(var i = 0; i< req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].name == req.query.name){
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
      alreadyExist = true;
    }
  }

  if(alreadyExist == false){
    req.session.dataCardBike.push({
      name: req.query.name,
      url: req.query.url,
      price: req.query.price,
      quantity: req.query.quantity
    })
  }

  res.redirect('/shop');
}

exports.deleteProduct = (req, res, next) => {
  req.session.dataCardBike.splice(req.query.position,1)
  res.redirect('/shop')
}

exports.updateProduct = (req, res, next) => {

    var position = req.body.position;
    var newQuantity = req.body.quantity;
  
    req.session.dataCardBike[position].quantity = newQuantity;
    res.redirect('/shop')
  }