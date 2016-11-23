let tape = require('tape');
let Couchtuner = require('../../scrapers/couchtuner');
let couch = new Couchtuner('http://www.couch-tuner.ag/');

tape('Listings', (t) => {
  couch.scrapeListings('tv-lists').then((anchors) => {
    t.equal(
      anchors.length,
      603,
      'Number of tv listings'
    );
  }).catch(t.fail).then(t.end);
});
