// The rates used here are pull from the following sources December 17, 2014:
//
// http://ec.europa.eu/taxation_customs/resources/documents/taxation/vat/how_vat_works/rates/vat_rates_en.pdf
// http://www.skatteetaten.no/en/Bedrift-og-organisasjon/Merverdiavgift/Guide-to-Value-Added-Tax-in-Norway/?chapter=3732#kapitteltekst
// http://en.wikipedia.org/wiki/Special_member_state_territories_and_the_European_Union
//
// The following is an extrapolation of special EU VAT rates and exemptions
// listed in the above PDF.
//
//   VAT Does Not Apply
//
//     Countries
//
//       FO - Faroe Islands - Denmark
//       GL - Greenland - Denmark
//       AX - Åland Islands - Finland
//       GF - French Guiana - France
//
//     Cities or regions
//
//       Canary Islands - Spain
//       Melilla - Spain
//       Ceuta - Spain
//       Büsingen am Hochrhein - Germany
//       Heligoland - Germany
//       Mount Athos - Greece
//       Campione d'Italia - Italy
//       Livigno - Italy
//
//     French overseas departments - these have a VAT similar to EU, but they are
//     not actually part of the EU VAT system, so you do not have to collect VAT
//     for e-services. The local VAT is 8.5%.
//     http://ec.europa.eu/taxation_customs/taxation/other_taxes/dock_dues/index_en.htm
//
//       GP - Guadeloupe
//       RE - Réunion
//       MQ - Martinique
//
//   Special VAT Rates
//
//     Monaco - France - 20%
//     Isle of Man - United Kingdom - 20%
//     Azores - Portugal - 18%
//     Madeira - Portugal - 22%
//     Akrotiri - Cyprus - 19%
//     Dhekelia - Cyprus - 19%
//     Jungholz - Austria - 19%
//     Mittelberg - Austria - 19%

// There are country entries and exceptions entries for places that are listed
// on the VAT exceptions list. A value of 0.0 means no VAT is to be collected.
rates = {
  BY_COUNTRY : {
    AT: { // Austria
        rate: Big('0.20'),
        exceptions: {
            'Jungholz': Big('0.19'),
            'Mittelberg': Big('0.19')
        }
    },
    BE: { // Belgium
        rate: Big('0.21')
    },
    BG: { // Bulgaria
        rate: Big('0.20')
    },
    CY: { // Cyprus
        rate: Big('0.19')
    },
    CZ: { // Czech Republic
        rate: Big('0.21')
    },
    DE: { // Germany
        rate: Big('0.19'),
        exceptions: {
            'Büsingen am Hochrhein': Big('0.0'),
            'Heligoland': Big('0.0')
        }
    },
    DK: { // Denmark
        rate: Big('0.25')
    },
    EE: { // Estonia
        rate: Big('0.20')
    },
    ES: { // Spain
        rate: Big('0.21'),
        exceptions: {
            'Canary Islands': Big('0.0'),
            'Ceuta': Big('0.0'),
            'Melilla': Big('0.0')
        }
    },
    FI: { // Finland
        rate: Big('0.24')
    },
    FR: { // France
        rate: Big('0.20')
    },
    GB: { // United Kingdom
        rate: Big('0.20'),
        exceptions: {
            // UK RAF Bases in Cyprus are taxed at Cyprus rate
            'Akrotiri': [Big('0.19'), 'CY', null],
            'Dhekelia': [Big('0.19'), 'CY', null]
        }
    },
    GR: { // Greece
        rate: Big('0.23'),
        exceptions: {
            'Mount Athos': Big('0.0')
        }
    },
    HR: { // Croatia
        rate: Big('0.25')
    },
    HU: { // Hungary
        rate: Big('0.27')
    },
    IE: { // Ireland
        rate: Big('0.23')
    },
    IT: { // Italy
        rate: Big('0.22'),
        exceptions: {
            "Campione d'Italia": Big('0.0'),
            'Livigno': Big('0.0')
        }
    },
    LT: { // Lithuania
        rate: Big('0.21')
    },
    LU: { // Luxembourg
        rate: Big('0.15')
    },
    LV: { // Latvia
        rate: Big('0.21')
    },
    MT: { // Malta
        rate: Big('0.18')
    },
    NL: { // Netherlands
        rate: Big('0.21')
    },
    PL: { // Poland
        rate: Big('0.23')
    },
    PT: { // Portugal
        rate: Big('0.23'),
        exceptions: {
            'Azores': Big('0.0'),
            'Madeira': Big('0.0')
        }
    },
    RO: { // Romania
        rate: Big('0.24')
    },
    SE: { // Sweden
        rate: Big('0.25')
    },
    SI: { // Slovenia
        rate: Big('0.22')
    },
    SK: { // Slovakia
        rate: Big('0.20')
    },

    // Countries associated with EU countries that have a special VAT rate
    MC: { // Monaco - France
        rate: Big('0.20')
    },
    IM: { // Isle of Man - United Kingdom
        rate: Big('0.20')
    },

    // Non-EU with their own VAT collection requirements
    NO: { // Norway
        rate: Big('0.25')
    }
  },
},
