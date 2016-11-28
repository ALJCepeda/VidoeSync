let fs = require('fs');
let jsdom = require('jsdom');
let jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js');
let couchjs = fs.readFileSync('./assets/couchtuner.js');
let Couchtuner = function() { };

let jsdomEnv = function(url) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      url: url,
      src: [jquery, couchjs],
      done: (err, window) => {
        if(err) return reject(err);

        return resolve(window);
      }
    });
  });
};

Couchtuner.prototype.scrapeTV = function(url) {
  return jsdomEnv(url).then((window) => {
    let anchors = window.$('div[style="width: 160px; padding-right: 20px; float: left;"] > ul > li > strong > a');

    return anchors.map((i, anchor) => {
            return {
              name:anchor.innerHTML,
              link:anchor.href
            };
          }).toArray();
  });
};

Couchtuner.prototype.scrapeEpisodes = function(url) {
  return jsdomEnv(url).then((window) => {
    let missed = [];
    let episodes = window.$('.entry > ul > li > strong > a').map((i, anchor) => {
      let name = anchor.innerHTML;
      let link = anchor.href;

      let matches = name.match(/.+[Ss](?:eason)?\s?(\d+)\s?[Ee](?:pisode)?\s?(\d+)/);
      if(matches === null) {
        missed.push({
          name:name,
          link:link
        });
        return;
      } else {
        let season = matches[1];
        let episode = matches[2];

        return { link, season, episode };
      }
    }).toArray();

    return { episodes, missed };
  });
};

Couchtuner.prototype.scrapeWatchIt = function(url) {
  if(url.indexOf('http://couch-tuner.city') === 0) {
    return Promise.resolve(url);
  }
  
  return jsdomEnv(url).then((window) => {
    let link = window.$('.entry > p > strong > a')[0].href;
    return link;
  });
};


Couchtuner.prototype.scrapeEpisodeID = function(url) {
  return jsdomEnv(url).then((window) => {
    let videoAnchors = window.$('.entry > ul > li > a');

    var links = [];
    videoAnchors.each((i, anchor) => {
      let parts = anchor.id.split('_');
      window.postTabs_show(parts[1], parts[0]);

      let source = window.$('b#ko > iframe').attr('src');
      links.push(source);
    });

    return links.map(l => l.match(/embed-(\w+)-/)[1]);
  });
};

module.exports = Couchtuner;
