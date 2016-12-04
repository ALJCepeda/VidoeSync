let tape = require('tape');
let Couchtuner = require('../../scrapers/couchtuner');
let answers = require('./couchtuner-json');
let couch = new Couchtuner();

tape.skip('scrapeTV', (t) => {
  couch.scrapeTV('http://www.couch-tuner.ag/tv-lists').then((anchors) => {
    t.equal(
      anchors.length,
      answers.scrapeTV.numOfListings,
      'Number of tv listings'
    );

    t.deepEqual(
      anchors[0],
      answers.scrapeTV.firstListing,
      'First listing returned by couchtuner'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('scrapeEpisodes', (t) => {
  couch.scrapeEpisodes('http://www.couch-tuner.ag/watch-the-walking-dead-online-streamin').then((result) => {
    t.equal(
      result.episodes.length,
      answers.scrapeEpisodes.numOfEpisodes,
      'Number of episodes'
    );

    t.equal(
      result.missed.length,
      answers.scrapeEpisodes.numOfMissed,
      'Number of mismatched links'
    );

    t.deepEqual(
      result.episodes[0],
      answers.scrapeEpisodes.firstEpisode,
      'First episode'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('scrapeWatchIt', (t) => {
  couch.scrapeWatchIt('http://www.couch-tuner.ag/2015/09/the-walking-dead-s06-greeting-from-the-set-of-season').then((result) => {
    t.equal(
      result,
      answers.watchIt.videoLink,
      'Link to page with video'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('scrapeWatchIt - Preresolved', (t) => {
  //Sometimes `scrapeEpisodes` returns a watchit link
  couch.scrapeWatchIt('http://couch-tuner.city/5/your-pretty-face-is-going-to-hell-s1e5').then((result) => {
    t.equal(
      result,
      answers.watchIt.videoLinkPreresolved,
      'Returns link if it\'s from `.city` tld'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('scrapeEpisodeLink', (t) => {
  couch.scrapeEpisodeLink('http://couch-tuner.city/5/the-walking-dead-s2-e7-pretty-much-dead-already/').then((result) => {
    t.deepEqual(
      result,
      answers.scrapeEpisodeLink.videoLinks,
      'Returns all embded video links'
    );
  }).catch(t.fail).then(t.end);
});

tape('scrapeEpisodeLink - duplicates', (t) => {
  //Gettind duplicate ideas when there more than one video
  couch.scrapeEpisodeLink('http://couch-tuner.city/5/your-family-or-mine-s1-e7-5-stages/').then((result) => {
    t.deepEqual(
      result,
      answers.scrapeEpisodeLink.duplicates,
      'Returns all episode links'
    );
  }).catch(t.fail).then(t.end);
});

tape.skip('Last Five', (t) => {
  couch.scrapeTV('http://www.couch-tuner.ag/tv-lists').then((listings) => {
    listings = listings.slice(-5);

    t.deepEqual(
      listings,
      answers.lastFive.listings,
      'Last five listings'
    );

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
    //Map last 5 and test
    for(let name in shows) {
      shows[name].episodes = shows[name].episodes.slice(-5);
    }

    t.deepEqual(
      shows,
      answers.lastFive.shows,
      'Last 5 episodes of each show'
    );

    return shows;
  }).then((shows) => {
    var watchits = Promise.resolve({});

    for(let name in shows) {
      let links = [];
      shows[name].episodes.forEach((entry) => {
        watchits = watchits.then((result) => {
          return couch.scrapeWatchIt(entry.link).then((link) => {
            links.push(link);
            result[name] = links;
            return result;
          });
        });
      });
    }

    return watchits;
  }).then((watchits) => {
    t.deepEqual(
      watchits,
      answers.lastFive.watchIts,
      'Converted episode links into watchit links'
    );
    let episodeIDs = Promise.resolve({});

    for(let name in watchits) {
      let ids = [];
      watchits[name].forEach((link) => {
        episodeIDs = episodeIDs.then((result) => {
          return couch.scrapeEpisodeLink(link).then((id) => {
            ids.push(id);
            result[name] = ids;
            return result;
          });
        });
      });
    }

    return episodeIDs;
  }).then((ids) => {
    t.deepEqual(
      ids,
      answers.lastFive.ids,
      'Converted wachits link into video ids'
    );
  }).catch(t.fail).then(t.end);
});
