let tape = require('tape');
let Couchtuner = require('../../scrapers/couchtuner');
let couch = new Couchtuner();

tape('TV', (t) => {
  couch.scrapeTV('http://www.couch-tuner.ag/tv-lists').then((anchors) => {
    t.equal(
      anchors.length,
      603,
      'Number of tv listings'
    );
  }).catch(t.fail).then(t.end);
});

tape('Episodes', (t) => {
  couch.scrapeEpisodes('http://www.couch-tuner.ag/watch-the-walking-dead-online-streamin').then((result) => {
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
  couch.scrapeWatchIt('http://www.couch-tuner.ag/2015/09/the-walking-dead-s06-greeting-from-the-set-of-season').then((result) => {
    t.equal(
      result,
      'http://couch-tuner.city/5/the-walking-dead-s06-greeting-from-the-set-of-season/',
      'Link to page with video'
    );
  }).catch(t.fail).then(t.end);
});

tape('Episode Link', (t) => {
  couch.scrapeEpisodeLink('http://couch-tuner.city/5/the-walking-dead-s2-e7-pretty-much-dead-already/').then((result) => {
    t.deepEqual(
      result,
      [ 'http://thevideo.me/embed-br03hat1bewy.html' ],
      'Returns all embded video links'
    );
  }).catch(t.fail).then(t.end);
});
