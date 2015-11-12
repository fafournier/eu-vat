if(Meteor.isServer){


  VAT = {};

  //get the npm package to validate vat number with VIES
  var VIESvalidate = Npm.require('validate-vat');
  if(VIESvalidate)
    VAT.validateVIES = Meteor.wrapAsync(VIESvalidate, VAT);

  // console.log("loading", VAT);
  //get json rates  - TODO get them once at server load then return it from local server to client
  //an alternative could be to get rates from http://www.vatlive.com/vat-rates/european-vat-rates/eu-vat-rates/ but it's manual
  // var request = new XMLHttpRequest();
  // request.open('GET', 'jsonvat.com', true);
  // request.onload = function() {
  //   if (request.status >= 200 && request.status < 400) { // Success!
  //
  //   }
  // };
  // request.send();
  var http = Npm.require('http');

  http.get("http://jsonvat.com", function(res){
      var body = '';
      res.on('data', function(chunk){
          body += chunk;
      });
      res.on('end', function(){
        var response = JSON.parse(body);
        if(response && response.rates)
        VAT.rates = response.rates;
        if(VAT.rates){
          console.log("Fetched jsonvat.com successfully"); //VAT.rates

        }else {
          console.warn("Error, fetching jsonvat.com", response)
        }
      });
  }).on('error', function(e){
      console.error("Error fetching jsonvat.com: ", e);
  });

  // console.log("loading", VAT);
  Big = Npm.require('big.js');

  VAT.vatMoss = {

    /*!
     * initial idea and source code from vat-moss.js v0.10.0,
     * modified by François Fournier for inclusion in the meteor EU-VAT package
     * https://github.com/wbond/vat-moss.js, https://github.com/fafournier/eu-vat/
     * Copyright 2015 Will Bond <will@wbond.net>, copyright 2015 François Fournier <francois.fournier@simitless.com>
     * Released under the MIT license
     */
        errors: {
          ValueError : function(message) {
              this.name = 'ValueError';
              exceptionConstructor(this, message);
          },
          UndefinitiveError : function(message) {
              this.name = 'UndefinitiveError';
              exceptionConstructor(this, message);
          },
          InvalidError : function(message) {
              this.name = 'InvalidError';
              exceptionConstructor(this, message);
          },
        },

        /**
         * The VAT rate that should be collected based on address information provided
         *
         * @param  {string} country_code  The two-character country code
         * @param  {string} postal_code   The postal code for the user
         * @param  {string} city          The city name for the user
         * @throws {errors.ValueError}  If country code is not two characers, or postal_code or city are not strings. postal_code may be None or blank string for countries without postal codes.
         * @return {object}  An object with the keys "rate" {Big}, "countryCode" {string} and "exceptionName" {string} or {null}
         */
        billingAddress: {
          calculateRate : function(countryCode, postalCode, city) {

              if (!countryCode || typeof(countryCode) !== 'string') {
                  throw new errors.ValueError('Invalidly formatted country code');
              }

              countryCode = countryCode.replace(/^\s+|\s+$/g, '');
              if (countryCode.length !== 2) {
                  // console.log('here');
                  throw new errors.ValueError('Invalidly formatted country code');
              }

              countryCode = countryCode.toUpperCase();

              if (!(countryCode in COUNTRIES_WITHOUT_POSTAL_CODES)) {
                  if (!postalCode || typeof(postalCode) !== 'string') {
                      throw new errors.ValueError('Postal code is not a string');
                  }
              }

              if (!city || typeof(city) !== 'string') {
                  throw new errors.ValueError('City is not a string');
              }

              if (typeof(postalCode) === 'string') {
                  postalCode = postalCode.replace(/\s+/g, '');
                  postalCode = postalCode.toUpperCase();

                  // Remove the common european practice of adding the country code
                  // to the beginning of a postal code, followed by a dash
                  if (postalCode.length > 3 && postalCode.substring(0, 3) === countryCode + '-') {
                      postalCode = postalCode.substring(3);
                  }

                  postalCode = postalCode.replace(/-/g, '');
              }

              city = city.toLowerCase().replace(/^\s+|\s+$/g, '');

              if (!(countryCode in rates.BY_COUNTRY) && !(countryCode in POSTAL_CODE_EXCEPTIONS)) {
                  return {
                      rate: Big('0.0'),
                      countryCode: countryCode,
                      exceptionName: null
                  };
              }


              var countryDefault = Big('0.0');
              if (countryCode in rates.BY_COUNTRY) {
                  countryDefault = rates.BY_COUNTRY[countryCode].rate;
              }


              if (!(countryCode in POSTAL_CODE_EXCEPTIONS)) {
                  return {
                      rate: countryDefault,
                      countryCode: countryCode,
                      exceptionName: null
                  };
              }

              var exceptions = POSTAL_CODE_EXCEPTIONS[countryCode];
              for (var i = 0; i < exceptions.length; i++) {
                  var exception = exceptions[i];

                  if (!exception.postalCode.test(postalCode)) {
                      continue;
                  }

                  if (exception.city && !exception.city.test(city)) {
                      continue;
                  }

                  var mappedCountry = exception.code;

                  // There is at least one entry where we map to a different country,
                  // but are not mapping to an exception
                  if (!('name' in exception)) {
                      countryCode = mappedCountry;
                      countryDefault = rates.BY_COUNTRY[countryCode].rate;
                      break;
                  }

                  var mappedName = exception.name;

                  var rate = rates.BY_COUNTRY[mappedCountry].exceptions[mappedName];
                  return {
                      rate: rate,
                      countryCode: mappedCountry,
                      exceptionName: mappedName
                  };
              }

              return {
                  rate: countryDefault,
                  countryCode: countryCode,
                  exceptionName: null
              };
          },
        },



        declaredResidence: {
          /**
           * Return a sorted array of objects, each containing the keys "name", "code"
           * and "exceptions". These should be used to build a user interface for
           * customers to declare their country of residence. If their declared
           * country of residence includes any exceptions, the user must be presented
           * with an option to select their residence as residing in an area with a
           * VAT exception.
           *
           * The country codes and names are from ISO 3166-1.
           *
           * @return {array}  An array of objects each with the keys "name", "code" and "exceptions"
           */
            options : function() {
                var output = [];
                for (var i = 0; i < RESIDENCE_OPTIONS.length; i++) {
                    var info = RESIDENCE_OPTIONS[i];
                    output.push({
                        name: info[0],
                        code: info[1],
                        exceptions: EXCEPTIONS_BY_COUNTRY[info[1]] || []
                    });
                }
                return output;
            },


            /**
             * Return an array of exception names for a country
             #
             # @param  {string}  countryCode  The two-character country code
             * @return {array}  An array of {string} exception names
             */
            exceptionsByCountry : function(countryCode) {
                return EXCEPTIONS_BY_COUNTRY[countryCode] || [];
            },


            /**
             * Calculates the VAT rate for a customer based on their declared country
             * and any declared exception information.
             *
             * @param  {string} country_code    The two-character country code where the user resides
             * @param  {string} exception_name  The name of an exception for the country, as returned from declaredResidence.options()
             * @throws {errors.ValueError}  if countryCode is not two characers, or exceptionName is not null or a valid exception from options()
             * @return {object}  An object with the keys "rate" {Big}, "countryCode" {string} and "exceptionName" {string} or {null}
             */
            calculateRate : function(countryCode, exceptionName) {

                if (!countryCode || typeof(countryCode) !== 'string' || countryCode.length != 2) {
                    throw new errors.ValueError('Invalidly formatted country code');
                }

                if (exceptionName && typeof(exceptionName) !== 'string') {
                    throw new errors.ValueError('Exception name is not None or a string');
                }

                countryCode = countryCode.toUpperCase();

                if (!(countryCode in rates.BY_COUNTRY)) {
                    return {
                        rate: Big('0.0'),
                        countryCode: countryCode,
                        exceptionName: null
                    };
                }

                var countryInfo = rates.BY_COUNTRY[countryCode];

                if (!exceptionName) {
                    return {
                        rate: countryInfo.rate,
                        countryCode: countryCode,
                        exceptionName: null
                    };
                }

                if (!(exceptionName in countryInfo.exceptions)) {
                    throw new errors.ValueError('"' + exceptionName + '" is not a valid exception for ' + countryCode);
                }

                var rateInfo = countryInfo.exceptions[exceptionName];
                var rate;

                // Test if the object is an array, otherwise a Big() number
                if (rateInfo instanceof Big) {
                    rate = rateInfo;
                } else {
                    // This allows handling the complex case of the UK RAF bases in Cyprus
                    // that map to the standard country rate. The country code and exception
                    // name need to be changed in addition to gettting a special rate.
                    rate = rateInfo[0];
                    countryCode = rateInfo[1];
                    exceptionName = rateInfo[2];
                }

                return {
                    rate: rate,
                    countryCode: countryCode,
                    exceptionName: exceptionName
                };
            },
        },


        /**
         *  Formats a decimal or Money object into an unambiguous string representation
         * for the purpose of invoices in English.
         *
         * @param  {Big}    amount    A Big or Money object
         * @param  {string} currency  If the amount is a Big, the currency of the amount
         * @throws {errors.ValueError}  If the amount is not a Money or Big object, or if the amount is a Big object and currency is not specified, or if currency is invalid
         * @return {string}  A string representation of the amount in the currency
         */
        exchangeRates: {
          format: function(amount, currency) {
            if (typeof(currency) === 'undefined' && 'currency' in amount) {
                currency = amount.currency;
            }

            // Allow bigmoney.js Money objects
            if (!(amount instanceof Big) && 'val' in amount) {
                amount = amount.val;
            }

            if (typeof(currency) !== 'string') {
                throw new errors.ValueError('The currency specified is not a string');
            }

            if (!(currency in CURRENCY_FORMATTING_RULES)) {
                var validCurrencies = [];
                for (var key in CURRENCY_FORMATTING_RULES) {
                    validCurrencies.push(key);
                }
                var formattedCurrencies = validCurrencies.join(', ');
                throw new errors.ValueError('The currency specified, "' + currency + '", is not a supported currency: ' + formattedCurrencies);
            }

            if (!(amount instanceof Big)) {
                throw new errors.ValueError('The amount specified is not a Big');
            }

            var rules = CURRENCY_FORMATTING_RULES[currency];

            result = amount.toFixed(rules.decimalPlaces);

            // Add thousands separators
            var parts = result.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            result = parts.join('.');

            result = result.replace(',', '_');
            result = result.replace('.', '|');

            result = result.replace('_', rules.thousandsSeparator);
            result = result.replace('|', rules.decimalMark);

            if (rules.symbolFirst) {
                result = rules.symbol + result;
            } else {
                result = result + rules.symbol;
            }

            return result;
          },


          /**
           * If using bigmoney.js, this will set up the exchange rate data. This
           * exchange rate data should be from the European Central Bank.
           *
           * If using the vat_moss Python library, it can be fetched via a call to
           * vat_moss.exchange_rates.fetch().
           *
           * @param {string} base   The currency code to use as the base
           * @param {object} rates  An object with three-character currency code keys, and rate {Big} values
           */
          setMoneySettings : function(base, rates) {
              Money.settings = {
                  base: base,
                  rates: rates
              };
          },
        },


        geoip2: {

          /**
           * Calculate the VAT rate from the data returned by a GeoLite2 database
           *
           * @param {string} countryCode         Two-character country code
           * @param {string} subdivision         The first subdivision name
           * @param {string} city                The city name
           * @param {string} addressCountryCode  The user's countryCode, as detected from billingAddress or declaredResidence. This prevents an UndefinitiveError from being thrown.
           * @param {string} addressEexception   The user's exception name, as detected from billingAddress or declaredResidence. This prevents an UndefinitiveError from being thrown.
           * @throws {errors.ValueError}  if countryCode is not two characers, or subdivision or city are not strings
           * @throws {errors.UndefinitiveError}  when no addressCountryCode and addressException are provided and the geoip2 information is not specific enough
           * @return  {object}  An object with the keys "rate" {Big}, "countryCode" {string} and "exceptionName" {string} or {null}
           */
          calculateRate : function(countryCode, subdivision, city, addressCountryCode, addressException) {

              if (!countryCode || typeof(countryCode) !== 'string' || countryCode.length != 2) {
                  throw new errors.ValueError('Invalidly formatted country code');
              }

              if (typeof(subdivision) !== 'string') {
                  throw new errors.ValueError('Subdivision is not a string');
              }

              if (typeof(city) !== 'string') {
                  throw new errors.ValueError('City is not a string');
              }

              countryCode = countryCode.toUpperCase();
              subdivision = subdivision.toLowerCase();
              city = city.toLowerCase();

              if (!(countryCode in rates.BY_COUNTRY)) {
                  return {
                      rate: Big('0.0'),
                      countryCode: countryCode,
                      exceptionName: null
                  };
              }

              var countryDefault = rates.BY_COUNTRY[countryCode].rate;

              if (!(countryCode in GEOIP2_EXCEPTIONS)) {
                  return {
                      rate: countryDefault,
                      countryCode: countryCode,
                      exceptionName: null
                  };
              }

              var exceptions = GEOIP2_EXCEPTIONS[countryCode];
              for (var matcher in exceptions) {
                  var matchParts = matcher.split('/');

                  var subMatch = matchParts[0];
                  var cityMatch = matchParts[1];

                  if (subMatch !== subdivision) {
                      continue;
                  }

                  if (cityMatch && cityMatch !== city) {
                      continue;
                  }

                  var info = exceptions[matcher];
                  var exceptionName = info.name;
                  if (!info.definitive) {
                      if (typeof(addressCountryCode) === 'undefined') {
                          throw new errors.UndefinitiveError('It is not possible to determine the users VAT rates based on the information provided');
                      }

                      if (addressCountryCode !== countryCode) {
                          continue;
                      }

                      if (addressException !== exceptionName) {
                          continue;
                      }
                  }

                  var rate = rates.BY_COUNTRY[countryCode].exceptions[exceptionName];
                  return {
                      rate: rate,
                      countryCode: countryCode,
                      exceptionName: exceptionName
                  };
              }

              return {
                  rate: countryDefault,
                  countryCode: countryCode,
                  exceptionName: null
              };
          },
        },


        /**
         * Returns a country name from the country code
         *
         * @param {string}  countryCode  The country code
         *
         * @throws {errors.ValidError}  If the countryCode is invalid or did not match a country from declaredResidence.options()
         * @return {string}  The country name
         */
        countryName : function(countryCode) {

            if (!countryCode || typeof(countryCode) !== 'string' || countryCode.length != 2) {
                throw new errors.ValueError('Invalidly formatted country code');
            }

            countryCode = countryCode.toUpperCase();

            if (!RESIDENCE_MAP) {
                RESIDENCE_MAP = {};
                for (var i=0; i < RESIDENCE_OPTIONS.length; i++) {
                    RESIDENCE_MAP[RESIDENCE_OPTIONS[i][1]] = RESIDENCE_OPTIONS[i][0];
                }
            }

            if (countryCode in RESIDENCE_MAP) {
                return RESIDENCE_MAP[countryCode];
            }

            throw new errors.ValueError('Invalid country code');
        },


        /**
         * Runs some basic checks to ensure a VAT ID looks properly formatted.
         *
         * @param {string} vatId  The VAT ID to check. Allows "GR" prefix for Greece, even though it should be "EL".
         *
         * @throws {errors.ValueError}    If the is not a string or is not in the format of two characters number an identifier
         * @throws {errors.InvalidError}  If the VAT ID is not valid
         * @return {object}  An object with the keys "countryCode" and "vatId" if ID looks like it may be valid. {null} if the VAT ID is blank or not for an EU country or Norway.
         */
        id: {
          check: function(vatId) {

            if (!vatId) {
                return null;
            }

            if (typeof(vatId) !== 'string') {
                throw new errors.ValueError('VAT ID is not a string');
            }

            if (vatId.length < 3) {
                throw new errors.ValueError('VAT ID must be at least three character long');
            }

            // Normalize the ID for simpler regexes
            vatId = vatId.replace(/\s+/g, '');
            vatId = vatId.replace(/-/g, '');
            vatId = vatId.replace(/\./g, '');
            vatId = vatId.toUpperCase();

            var countryPrefix = vatId.substring(0, 2);

            // Fix people using GR prefix for Greece
            if (countryPrefix === 'GR') {
                vatId = 'EL' + vatId.substring(2);
                countryPrefix = 'EL';
            }

            if (!(countryPrefix in ID_PATTERNS)) {
                return null;
            }

            var number = vatId.substring(2);

            if (!ID_PATTERNS[countryPrefix].regex.test(number)) {
                throw new errors.InvalidError('VAT ID does not appear to be properly formatted for ' + countryPrefix);
            }

            return {
                countryCode: ID_PATTERNS[countryPrefix].code,
                vatId: vatId
            };
          },
        },


        /**
         * Calculates the VAT rates based on a telephone number
         *
         * @param {string} phoneNumber         The phone number, in international format with leading +
         * @param {string} addressCountryCode  The user's countryCode, as detected from billingAddress or declaredResidence. This prevents an UndefinitiveError from being thrown.
         * @param {string} addressException    The user's exception name, as detected from billingAddress or declaredResidence. This prevents an UndefinitiveError from being thrown.
         * @throws {errors.ValueError}         error with phone number provided
         * @throws {errors.UndefinitiveError}  when no addressCountryCode and addressException are provided and the phone number area code matching isn't specific enough
         * @return {object}  An object with the keys "rate" {Big}, "countryCode" {string} and "exceptionName" {string} or {null}
         */
        phoneNumber: {
          calculateRate : function(phoneNumber, addressCountryCode, addressException) {

            if (!phoneNumber) {
                throw new errors.ValueError('No phone number provided');
            }

            if (typeof(phoneNumber) !== 'string') {
                throw new errors.ValueError('Phone number is not a string');
            }

            phoneNumber = phoneNumber.replace(/^\s+|\s+$/g, '');
            phoneNumber = phoneNumber.replace(/[^+0-9]/g, '');

            if (!phoneNumber || phoneNumber[0] !== '+') {
                throw new errors.ValueError('Phone number is not in international format with a leading +');
            }

            phoneNumber = phoneNumber.substring(1);

            if (!phoneNumber) {
                throw new errors.ValueError('Phone number does not appear to contain any digits');
            }

            var countryCode = null;
            var leadingDigit = phoneNumber[0];

            if (leadingDigit in CALLING_CODE_MAPPING) {
                for (var i = 0; i < CALLING_CODE_MAPPING[leadingDigit].length; i++) {
                    var mapping = CALLING_CODE_MAPPING[leadingDigit][i];
                    if (!mapping[1].test(phoneNumber)) {
                        continue;
                    }
                    countryCode = mapping[0];
                    break;
                }
            }

            if (!countryCode) {
                throw new errors.ValueError('Phone number does not appear to be a valid international phone number');
            }

            if (countryCode in CALLING_CODE_EXCEPTIONS) {
                for (var j = 0; j < CALLING_CODE_EXCEPTIONS[countryCode].length; j++) {
                    var exception = CALLING_CODE_EXCEPTIONS[countryCode][j];

                    if (!exception.regex.test(phoneNumber)) {
                        continue;
                    }

                    var mappedCountry = exception.code;
                    var mappedName = exception.name;

                    if (!exception.definitive) {
                        if (typeof(addressCountryCode) === 'null') {
                            throw new errors.UndefinitiveError('It is not possible to determine the users VAT rates based on the information provided');
                        }

                        if (addressCountryCode !== mappedCountry) {
                            continue;
                        }

                        if (addressException !== exception.name) {
                            continue;
                        }
                    }

                    var rate = rates.BY_COUNTRY[mappedCountry].exceptions[mappedName];
                    return {
                        rate: rate,
                        countryCode: mappedCountry,
                        exceptionName: mappedName
                    };
                }
            }

            if (!(countryCode in rates.BY_COUNTRY)) {
                return {
                    rate: Big('0.0'),
                    countryCode: countryCode,
                    exceptionName: null
                };
            }

            return {
                rate: rates.BY_COUNTRY[countryCode].rate,
                countryCode: countryCode,
                exceptionName: null
            };
          },
        },
  }

  // console.log("loading", VAT);
}
