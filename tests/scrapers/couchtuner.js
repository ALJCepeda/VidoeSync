let tape = require('tape');
let Couchtuner = require('../../scrapers/couchtuner');
let couch = new Couchtuner('http://www.couch-tuner.ag/');

tape('TV', (t) => {
  couch.scrapeTV('tv-lists').then((anchors) => {
    t.equal(
      anchors.length,
      603,
      'Number of tv listings'
    );
  }).catch(t.fail).then(t.end);
});
/*
tape('Episodes', (t) => {
  couch.scrapeSeasons('watch-the-walking-dead-online-streamin').then((seasons) => {
    console.log(seasons.length);
  });
});*/
