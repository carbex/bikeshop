var stripe = Stripe('pk_test_51IbjhSEifScnyKE579vUUWmbSL20LRIN7X13Nj03ndOsmQCCXtTGPg1pAs5LC5KDhxdkuWwRFePrT2PdYLfnKOL200dhh0nXdu');
var checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', function() {
  fetch('/stripe', {
    method: 'POST',
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(session) {
    return stripe.redirectToCheckout({ sessionId: session.id });
  })
  .then(function(result) {
    // If `redirectToCheckout` fails due to a browser or network
    // error, you should display the localized error message to your
    // customer using `error.message`.
    if (result.error) {
      alert(result.error.message);
    }
  })
  .catch(function(error) {
    console.error('Error:', error);
  });
});

const radios = document.getElementsByName('modeLivraisonId');

for(let i=0; i<radios.length; i++ ) {
    radios[i].addEventListener('click',function(){
      radios[i].closest("form").submit();
    })
}

