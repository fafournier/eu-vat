
  // A list of regular expressions to map against an internation phone number that
  // has had the leading + stripped off.
  //
  // The mapping is in the form:
  //
  // {
  //     digit: [
  //         [
  //             two character country code, regex
  //         ], ...
  //     ]
  // }
  //
  // The values are a list so that more specific regexes will be matched first.
  // This is necessary since sometimes multiple countries use the same
  // international calling code prefix.
  CALLING_CODE_MAPPING = {
      '1': [
          ['CA', /^1(204|226|236|249|250|289|306|343|365|387|403|416|418|431|437|438|450|506|514|519|548|579|581|587|600|604|613|622|633|639|644|647|655|672|677|688|705|709|742|778|780|782|807|819|825|867|873|902|905)/],
          ['AG', /^1268/],
          ['AI', /^1264/],
          ['AS', /^1684/],
          ['BB', /^1246/],
          ['BM', /^1441/],
          ['BS', /^1242/],
          ['DM', /^1767/],
          ['DO', /^1(809|829|849)/],
          ['GD', /^1473/],
          ['GU', /^1671/],
          ['JM', /^1876/],
          ['KN', /^1869/],
          ['KY', /^1345/],
          ['LC', /^1758/],
          ['MP', /^1670/],
          ['MS', /^1664/],
          ['PR', /^1(939|787)/],
          ['SX', /^1721/],
          ['TC', /^1649/],
          ['TT', /^1868/],
          ['VC', /^1784/],
          ['VG', /^1284/],
          ['VI', /^1340/],
          ['US', /^1/],
      ],
      '2': [
          ['EG', /^20/],
          ['SS', /^211/],
          ['EH', /^212(5288|5289)/],
          ['MA', /^212/],
          ['DZ', /^213/],
          ['TN', /^216/],
          ['LY', /^218/],
          ['GM', /^220/],
          ['SN', /^221/],
          ['MR', /^222/],
          ['ML', /^223/],
          ['GN', /^224/],
          ['CI', /^225/],
          ['BF', /^226/],
          ['NE', /^227/],
          ['TG', /^228/],
          ['BJ', /^229/],
          ['MU', /^230/],
          ['LR', /^231/],
          ['SL', /^232/],
          ['GH', /^233/],
          ['NG', /^234/],
          ['TD', /^235/],
          ['CF', /^236/],
          ['CM', /^237/],
          ['CV', /^238/],
          ['ST', /^239/],
          ['GQ', /^240/],
          ['GA', /^241/],
          ['CG', /^242/],
          ['CD', /^243/],
          ['AO', /^244/],
          ['GW', /^245/],
          ['IO', /^246/],
          ['AC', /^247/],
          ['SC', /^248/],
          ['SD', /^249/],
          ['RW', /^250/],
          ['ET', /^251/],
          ['SO', /^252/],
          ['DJ', /^253/],
          ['KE', /^254/],
          ['TZ', /^255/],
          ['UG', /^256/],
          ['BI', /^257/],
          ['MZ', /^258/],
          ['ZM', /^260/],
          ['MG', /^261/],
          ['YT', /^262269/],
          ['RE', /^262/],
          ['ZW', /^263/],
          ['NA', /^264/],
          ['MW', /^265/],
          ['LS', /^266/],
          ['BW', /^267/],
          ['SZ', /^268/],
          ['KM', /^269/],
          ['ZA', /^27/],
          ['SH', /^290/],
          ['ER', /^291/],
          ['AW', /^297/],
          ['FO', /^298/],
          ['GL', /^299/],
      ],
      '3': [
          ['GR', /^30/],
          ['NL', /^31/],
          ['BE', /^32/],
          ['FR', /^33/],
          ['ES', /^34/],
          ['GI', /^350/],
          ['PT', /^351/],
          ['LU', /^352/],
          ['IE', /^353/],
          ['IS', /^354/],
          ['AL', /^355/],
          ['MT', /^356/],
          ['CY', /^357/],
          ['AX', /^35818/], // Åland Islands (to exclude from FI)
          ['FI', /^358/],
          ['BG', /^359/],
          ['HU', /^36/],
          ['LT', /^370/],
          ['LV', /^371/],
          ['EE', /^372/],
          ['MD', /^373/],
          ['AM', /^374/],
          ['BY', /^375/],
          ['AD', /^376/],
          ['XK', /^377(44|45)/],
          ['MC', /^377/],
          ['SM', /^378/],
          ['VA', /^379/],
          ['UA', /^380/],
          ['XK', /^381(28|29|38|39)/],
          ['RS', /^381/],
          ['ME', /^382/],
          ['XK', /^383/],
          ['HR', /^385/],
          ['XK', /^386(43|49)/],
          ['SI', /^386/],
          ['BA', /^387/],
          ['MK', /^389/],
          ['VA', /^3906698/],
          ['IT', /^39/],
      ],
      '4': [
          ['RO', /^40/],
          ['CH', /^41/],
          ['CZ', /^420/],
          ['SK', /^421/],
          ['LI', /^423/],
          ['AT', /^43/],
          ['GG', /^44(148|7781|7839|7911)/], // Guernsey (to exclude from GB)
          ['JE', /^44(153|7509|7797|7937|7700|7829)/], // Jersey (to exclude from GB)
          ['IM', /^44(162|7624|7524|7924)/], // Isle of Man
          ['GB', /^44/],
          ['DK', /^45/],
          ['SE', /^46/],
          ['NO', /^47/],
          ['PL', /^48/],
          ['DE', /^49/],
      ],
      '5': [
          ['FK', /^500/],
          ['BZ', /^501/],
          ['GT', /^502/],
          ['SV', /^503/],
          ['HN', /^504/],
          ['NI', /^505/],
          ['CR', /^506/],
          ['PA', /^507/],
          ['PM', /^508/],
          ['HT', /^509/],
          ['PE', /^51/],
          ['MX', /^52/],
          ['CU', /^53/],
          ['AR', /^54/],
          ['BR', /^55/],
          ['CL', /^56/],
          ['CO', /^57/],
          ['VE', /^58/],
          ['MF', /^590(590(51|52|58|77|87)|690(10|22|27|66|77|87|88))/],
          ['BL', /^590590(27|29)/],
          ['GP', /^590/],
          ['BO', /^591/],
          ['GY', /^592/],
          ['EC', /^593/],
          ['GF', /^594/],
          ['PY', /^595/],
          ['MQ', /^596/],
          ['SR', /^597/],
          ['UY', /^598/],
          ['CW', /^5999/],
          ['BQ', /^599/],
      ],
      '6': [
          ['MY', /^60/],
          ['CX', /^6189164/],
          ['CC', /^6189162/],
          ['AU', /^61/],
          ['ID', /^62/],
          ['PH', /^63/],
          ['NZ', /^64/],
          ['SG', /^65/],
          ['TH', /^66/],
          ['TL', /^670/],
          ['NF', /^6723/],
          ['AQ', /^6721/],
          ['BN', /^673/],
          ['NR', /^674/],
          ['PG', /^675/],
          ['TO', /^676/],
          ['SB', /^677/],
          ['VU', /^678/],
          ['FJ', /^679/],
          ['PW', /^680/],
          ['WF', /^681/],
          ['CK', /^682/],
          ['NU', /^683/],
          ['WS', /^685/],
          ['KI', /^686/],
          ['NC', /^687/],
          ['TV', /^688/],
          ['PF', /^689/],
          ['TK', /^690/],
          ['FM', /^691/],
          ['MH', /^692/],
      ],
      '7': [
          ['GE', /^7(840|940)/],
          ['RU', /^7[3489]/],
          ['KZ', /^7[67]/],
      ],
      '8': [
          ['JP', /^81/],
          ['KR', /^82/],
          ['VN', /^84/],
          ['KP', /^850/],
          ['HK', /^852/],
          ['MO', /^853/],
          ['KH', /^855/],
          ['LA', /^856/],
          ['CN', /^86/],
          ['BD', /^880/],
          ['TW', /^886/],
      ],
      '9': [
          ['TR', /^90/],
          ['IN', /^91/],
          ['PK', /^92/],
          ['AF', /^93/],
          ['LK', /^94/],
          ['MM', /^95/],
          ['MV', /^960/],
          ['LB', /^961/],
          ['JO', /^962/],
          ['SY', /^963/],
          ['IQ', /^964/],
          ['KW', /^965/],
          ['SA', /^966/],
          ['YE', /^967/],
          ['OM', /^968/],
          ['PS', /^970/],
          ['AE', /^971/],
          ['IL', /^972/],
          ['BH', /^973/],
          ['QA', /^974/],
          ['BT', /^975/],
          ['MN', /^976/],
          ['NP', /^977/],
          ['IR', /^98/],
          ['TJ', /^992/],
          ['TM', /^993/],
          ['AZ', /^994/],
          ['GE', /^995/],
          ['KG', /^996/],
          ['UZ', /^998/],
      ]
  };


  // The code key is included with these exceptions since some cities have
  // phone service from more than one country.
  //
  // The main dict key is the country code, as matched from CALLING_CODE_MAPPING
  CALLING_CODE_EXCEPTIONS = {
      AT: [
          {
              regex: /435676/,
              code: 'AT',
              name: 'Jungholz',
              definitive: true
          },
          {
              regex: /435517/,
              code: 'AT',
              name: 'Mittelberg',
              definitive: false
          }
      ],
      CH: [
          {
              regex: /4152/,
              code: 'DE',
              name: 'Büsingen am Hochrhein',
              definitive: false
          },
          {
              regex: /4191/,
              code: 'IT',
              name: "Campione d'Italia",
              definitive: false
          }
      ],
      DE: [
          {
              regex: /494725/,
              code: 'DE',
              name: 'Heligoland',
              definitive: true
          },
          {
              regex: /497734/,
              code: 'DE',
              name: 'Büsingen am Hochrhein',
              definitive: false
          }
      ],
      ES: [
          {
              regex: /34(822|828|922|928)/,
              code: 'ES',
              name: 'Canary Islands',
              definitive: true
          },
          {
              regex: /34956/,
              code: 'ES',
              name: 'Ceuta',
              definitive: false
          },
          {
              regex: /34952/,
              code: 'ES',
              name: 'Melilla',
              definitive: false
          }
      ],
      GR: [
          {
              // http://www.mountathosinfos.gr/pages/agionoros/telefonbook.en.html
              // http://www.athosfriends.org/PilgrimsGuide/information/#telephones
              regex: /3023770(23|41488|41462|22586|24039|94098)/,
              code: 'GR',
              name: 'Mount Athos',
              definitive: true
          }
      ],
      IT: [
          {
              regex: /390342/,
              code: 'IT',
              name: 'Livigno',
              definitive: false
          }
      ],
      PT: [
          {
              regex: /35129[256]/,
              code: 'PT',
              name: 'Azores',
              definitive: true
          },
          {
              regex: /351291/,
              code: 'PT',
              name: 'Madeira',
              definitive: true
          }
      ]
  };
