let tape = require('tape');
let Couchtuner = require('../../scrapers/couchtuner');
let couch = new Couchtuner();

tape.skip('TV', (t) => {
  couch.scrapeTV('http://www.couch-tuner.ag/tv-lists').then((anchors) => {
    t.equal(
      anchors.length,
      603,
      'Number of tv listings'
    );

    t.deepEqual(
      anchors[0],
      { name: '11.22.63',
        link: 'http://www.couch-tuner.ag/watch-11-22-63-online/' },
      'First listing returned by couchtuner'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('Episodes', (t) => {
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

    t.deepEqual(
      result.episodes[0],
      { link: 'http://www.couch-tuner.ag/2016/11/the-walking-dead-season-7-episode-5-go-getters/',
        season: '7',
        episode: '5' },
      'First episode'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('Watch It', (t) => {
  couch.scrapeWatchIt('http://www.couch-tuner.ag/2015/09/the-walking-dead-s06-greeting-from-the-set-of-season').then((result) => {
    t.equal(
      result,
      'http://couch-tuner.city/5/the-walking-dead-s06-greeting-from-the-set-of-season/',
      'Link to page with video'
    );
  }).catch(t.fail).then(t.end);
});

tape('Watch It - Preresolved', (t) => {
  //Sometimes `scrapeEpisodes` returns a watchit link
  couch.scrapeWatchIt('http://couch-tuner.city/5/your-pretty-face-is-going-to-hell-s1e5').then((result) => {
    t.equal(
      result,
      'http://couch-tuner.city/5/your-pretty-face-is-going-to-hell-s1e5',
      'Returns link if it\'s from `.city` tld'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('Episode Link', (t) => {
  couch.scrapeEpisodeID('http://couch-tuner.city/5/the-walking-dead-s2-e7-pretty-much-dead-already/').then((result) => {
    t.deepEqual(
      result,
      [ 'br03hat1bewy' ],
      'Returns all embded video links'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('First Five', (t) => {
  couch.scrapeTV('http://www.couch-tuner.ag/tv-lists').then((listings) => {
    listings = listings.slice(-5);

    var shows = Promise.resolve({});

    listings.forEach((listing) => {
      shows = shows.then((result) => {
        return couch.scrapeEpisodes(listing.link).then((episode) => {
          result[listing.name] = episode;
          return result;
        });
      });
    });

    return shows;
  }).then((shows) => {
    var watchits = Promise.resolve({});

    for(let name in shows) {
      let entries = shows[name].episodes.slice(-5);

      entries.forEach((entry) => {
        watchits = watchits.then((result) => {
          console.log(entry.link);
          return couch.scrapeWatchIt(entry.link).then((link) => {
            result[name] = link;
            return result;
          });
        });
      });
    }

    return watchits;
  }).then((watchits) => {
    console.log(watchits);
  }).catch(t.fail).then(t.end);
});
