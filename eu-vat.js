// Write your package code here!

VAT = {};

//get the npm package to validate vat number with VIES
VAT.validateVIES = Npm.require('validate-vat');

//get json rates  - TODO get them once at server load then return it from local server to client
var request = new XMLHttpRequest();
request.open('GET', 'jsonvat.com', true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400) { // Success!
    var response = JSON.parse(request.responseText);
    if(response && response.rate)
    VAT.rates = response.rate;
  }
};
request.send();
//VAT.rates = ("http://jsonvat.com/").rates  // an alternative could be to get rates from http://www.vatlive.com/vat-rates/european-vat-rates/eu-vat-rates/
