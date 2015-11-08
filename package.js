Package.describe({
  name: 'fafournier:eu-vat',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'This package allows to work with EU-VAT.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/fafournier/eu-vat/',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  validate-vat: "0.3.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('eu-vat.js');
  api.export("VAT");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('fafournier:eu-vat');
  api.addFiles('eu-vat-tests.js');
});
