let tape = require('tape');
let Couchtuner = require('../../scrapers/couchtuner');
let couch = new Couchtuner('http://www.couch-tuner.ag/');

tape.skip('TV', (t) => {
  couch.scrapeTV('tv-lists').then((anchors) => {
    t.equal(
      anchors.length,
      603,
      'Number of tv listings'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('Episodes', (t) => {
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

tape('Watch It', (t) => {
  couch.scrapeWatchIt('2015/09/the-walking-dead-s06-greeting-from-the-set-of-season').then((result) => {
    t.equal(
      result,
      'http://couch-tuner.city/5/the-walking-dead-s06-greeting-from-the-set-of-season/',
      'Link to page with video'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('Episode Link', (t) => {
  couch.scrapeEpisodeLink('5/the-walking-dead-s06-greeting-from-the-set-of-season/').then((result) => {
    console.log(result);
  });
});
