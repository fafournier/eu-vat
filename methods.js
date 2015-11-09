if(Meteor.isServer){

  Meteor.methods({
    "VAT.validateVIES": function(countryCode, vatNumber){
      // console.log("test", countryCode, vatNumber);
      return VAT.validateVIES(countryCode, vatNumber);
    },
    // "VAT.rates": function(){
    //   console.log("gimme rates");
    //   return VAT.rates;
    // }
  //   "VAT.billingAddress.calculateRate": function(){
  //
  //   },
  //   "VAT.declaredResidence.calculateRate": function(){
  //
  //   }
  });
}
