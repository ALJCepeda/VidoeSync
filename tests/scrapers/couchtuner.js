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

tape('Episodes', (t) => {
  couch.scrapeEpisodes('watch-the-walking-dead-online-streamin').then((result) => {
    t.equal(
      result.episodes.length,
      91,
      'Number of episodes'
    );

    t.equal(
      result.missed.length,
      2,
      'Number of mismatched links'
    );
  }).catch(t.fail).then(t.end);
});
