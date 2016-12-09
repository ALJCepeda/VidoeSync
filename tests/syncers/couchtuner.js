let tape = require('tape');
let Couchtuner = require('../../syncers/couchtuner');
let answers = require('./couchtuner-json');
let couch = new Couchtuner();

couch.syncListings().then((result) => {
  console.log(result);
});
