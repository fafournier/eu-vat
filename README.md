This package provides tools to handle European VAT.

This is a really early version with lots of unfinished things but it will become better soon. Feel free to do pull requests and other suggestions. I will listen!

== validate-vat ==
First, it wraps around the validate-vat npm package and provides a nice wrapAsync'ed method that can be called from the client to check VAT numbers: https://github.com/viruschidai/validate-vat
 === Usage ===

    Meteor.call("VAT.validateVIES",'xx',  'xxxxxxx',  function(err, validationInfo) {
        console.log(validationInfo);
    });

=== Returns ===

when valid
    {
      countryCode: 'xx',
      vatNumber: 'xxxxxxxxx',
      requestDate: '2013-11-22+01:00',
      valid: true,
      name: 'company name',
      address: 'company address'
    }

when invalid
    {
      countryCode: 'xx',
      vatNumber: 'xxxxxxxxxx',
      requestDate: '2013-11-22+01:00',
      valid: false,
      name: '---',
      address: '---'
    }

possible error messages
      'The provided CountryCode is invalid or the VAT number is empty'
      'The VIES VAT service is unavailable, please try again later'
      'The VAT database of the requested member country is unavailable, please try again later'
      'The request to VAT database of the requested member country has timed out, please try again later'
      'The service cannot process your request, please try again later'
      'Unknown error'

Check https://github.com/viruschidai/validate-vat for more information

== VAT rate finding ==

Second, on the server side, the package integrates (experimental, needs testing...) VAT-MOSS from https://github.com/wbond/vat-moss.js.

Unfortunately, due to my inability of understanding the way the package is written and mostly, how it's supposed to be included (looks like a npm package but not a published one so you need to have it locally...), I had to copy and manipulate the code directly.

 === Usage ===
It is based on the usage from https://github.com/wbond/vat-moss.js but with VAT instead of vatMoss

     try {
        // Values from payment provider
        var countryCode = 'US';
        var postalCode = '01950';
        var city = 'Newburyport';

        var result = VAT.billingAddress.calculateRate(countryCode, postalCode, city);

        // Combine with other rate detection and then show user tax rate/amount

    } catch (e) {
        // VAT.errors.ValueError - One of the user input values is empty or not a string
    }



== VAT rates ==
Lastly, not yet working, this package should get current VAT rates from http://jsonvat.com/ and daily exchange rates from http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml. Soon hopefully.
Should all that be split in multiple packages? ...
