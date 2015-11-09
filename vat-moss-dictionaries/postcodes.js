

  // A dictionary of countries, each being dictionary with keys that are either
  // a string postal code regex, or a tuple of postal code regex and city name
  // regex.
  //
  // There is a code value because some jurisdictions have post offices
  // through multiple countries.
  //
  // These should only be used with billing addresses.
  POSTAL_CODE_EXCEPTIONS = {
      AT: [
          {
              postalCode: /^6691$/,
              code: 'AT',
              name: 'Jungholz'
          },
          {
              postalCode: /^699[123]$/,
              city: /\bmittelberg\b/i,
              code: 'AT',
              name: 'Mittelberg'
          }
      ],
      CH: [
          {
              postalCode: /^8238$/,
              code: 'DE',
              name: 'Büsingen am Hochrhein'
          },
          {
              postalCode: /^6911$/,
              code: 'IT',
              name: "Campione d'Italia"
          },
          // The Italian city of Domodossola has a Swiss post office also
          {
              postalCode: /^3907$/,
              code: 'IT'
          }
      ],
      DE: [
          {
              postalCode: /^87491$/,
              code: 'AT',
              name: 'Jungholz'
          },
          {
              postalCode: /^8756[789]$/,
              city: /\bmittelberg\b/i,
              code: 'AT',
              name: 'Mittelberg'
          },
          {
              postalCode: /^78266$/,
              code: 'DE',
              name: 'Büsingen am Hochrhein'
          },
          {
              postalCode: /^27498$/,
              code: 'DE',
              name: 'Heligoland'
          }
      ],
      ES: [
          {
              postalCode: /^(5100[1-5]|5107[0-1]|51081)$/,
              code: 'ES',
              name: 'Ceuta'
          },
          {
              postalCode: /^(5200[0-6]|5207[0-1]|52081)$/,
              code: 'ES',
              name: 'Melilla'
          },
          {
              postalCode: /^(35\d{3}|38\d{3})$/,
              code: 'ES',
              name: 'Canary Islands'
          }
      ],
      // The UK RAF bases in Cyprus are taxed at the Cyprus rate
      GB: [
          // Akrotiri
          {
              postalCode: /^BFPO57|BF12AT$/,
              code: 'CY'
          },
          // Dhekelia
          {
              postalCode: /^BFPO58|BF12AU$/,
              code: 'CY'
          }
      ],
      GR: [
          {
              postalCode: /^63086$/,
              code: 'GR',
              name: 'Mount Athos'
          }
      ],
      IT: [
          {
              postalCode: /^22060$/,
              city: /\bcampione\b/i,
              code: 'IT',
              name: "Campione d'Italia"
          },
          {
              postalCode: /^23030$/,
              city: /\blivigno\b/i,
              code: 'IT',
              name: 'Livigno'
          }
      ],
      PT: [
          {
              postalCode: /^9[0-4]\d{2,}$/,
              code: 'PT',
              name: 'Madeira'
          },
          {
              postalCode: /^9[5-9]\d{2,}$/,
              code: 'PT',
              name: 'Azores'
          }
      ]
  };


  COUNTRIES_WITHOUT_POSTAL_CODES = {
      AE: true,
      AG: true,
      AN: true,
      AO: true,
      AW: true,
      BF: true,
      BI: true,
      BJ: true,
      BS: true,
      BW: true,
      BZ: true,
      CD: true,
      CF: true,
      CG: true,
      CI: true,
      CK: true,
      CM: true,
      DJ: true,
      DM: true,
      ER: true,
      FJ: true,
      GD: true,
      GH: true,
      GM: true,
      GN: true,
      GQ: true,
      GY: true,
      HK: true,
      IE: true,
      JM: true,
      KE: true,
      KI: true,
      KM: true,
      KN: true,
      KP: true,
      LC: true,
      ML: true,
      MO: true,
      MR: true,
      MS: true,
      MU: true,
      MW: true,
      NR: true,
      NU: true,
      PA: true,
      QA: true,
      RW: true,
      SA: true,
      SB: true,
      SC: true,
      SL: true,
      SO: true,
      SR: true,
      ST: true,
      SY: true,
      TF: true,
      TK: true,
      TL: true,
      TO: true,
      TT: true,
      TV: true,
      TZ: true,
      UG: true,
      VU: true,
      YE: true,
      ZA: true,
      ZW: true
  };

  exceptionConstructor = function(that_, message) {
      that_.message = message;
      var err = new Error();
      var stackFirstLine = that_.name;
      if (that_.message) {
          stackFirstLine += ': ' + that_.message;
      }
      if (typeof(Components) != 'undefined') {
          // Mozilla:
          that_.stack = err.stack.substring(err.stack.indexOf('\n')+1);
      } else if (typeof(chrome) != 'undefined' || typeof(process) != 'undefined') {
          // Google Chrome/Node.js:
          that_.stack = stackFirstLine + err.stack.replace(/^Error:?[ ]*\n[^\n]*/, '');
      } else {
          that_.stack = err.stack;
      }
  }
