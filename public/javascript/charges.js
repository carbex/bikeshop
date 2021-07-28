// document.getElementById('standard').addEventListener('click', function() {
//     document.getElementById('standard').closest("form").submit();
//     document.getElementById('standard').checked = true;

// });
// document.getElementById('express').addEventListener('click', function() {
//     document.getElementById('express').closest("form").submit().checked = true;
// });
// document.getElementById('relaisPoint').addEventListener('click', function() {
//     document.getElementById('relaisPoint').closest("form").submit().checked = true;
// });


var calculTotalCommande = (dataCardBike, modeLivraison) => {

    var totalCmd = 0
    var montantFraisPort = modeLivraison.montant
  
    for(var i = 0; i< dataCardBike.length; i++){
      totalCmd += dataCardBike[i].quantity * dataCardBike[i].price
    }
  
    totalCmd += montantFraisPort
  
    return {charges: montantFraisPort, commande: totalCmd}
  }

var getModeLivraison = (dataCardBike) => {

    var nbProduits = 0
    var totalCmd = 0
    var listModeLivraisonDispo = []

    for(var i = 0; i< dataCardBike.length; i++){
      nbProduits += dataCardBike[i].quantity
      totalCmd += dataCardBike[i].quantity * dataCardBike[i].price

    //   if(i==0){
    //     listModeLivraisonDispo = dataCardBike[i].modeLiv
    //   }
    //   listModeLivraisonDispo = listModeLivraisonDispo.filter(e => dataCardBike[i].modeLiv.includes(e))
    }

   
  
    //Règle frais de port standard
    var montantFraisPortStandard = nbProduits * 30
    if(totalCmd>4000){
      montantFraisPortStandard = 0
    } else if(totalCmd>2000){
      montantFraisPortStandard = montantFraisPortStandard / 2
    }
  
    //Règle frais de port express
    var montantFraisPortExpress = montantFraisPortStandard+100
  
    //Règle frais de port Retrait
    var montantFraisPortRetrait= nbProduits * 20 + 50

    var listeModeLivraison = [
      {id:1, libelle:'Standard', montant:montantFraisPortStandard},
      {id:2, libelle:'Express', montant:montantFraisPortExpress},
      {id:3, libelle:'Retrait', montant:montantFraisPortRetrait},
    ]

    // listeModeLivraison = listeModeLivraison.filter(e => listModeLivraisonDispo.includes(e.id))

    function compare( a, b ) {
        if ( a.montant < b.montant ){
          return -1;
        }
        if ( a.montant > b.montant ){
          return 1;
        }
        return 0;
      }
      
    listeModeLivraison = listeModeLivraison.sort( compare );

    for(let i=0; i<listeModeLivraison.length; i++) {
        listeModeLivraison[i].id = i+1
    }  
    
    return listeModeLivraison;
  
  }
  

module.exports = {calculTotalCommande, getModeLivraison};

