let fs = require('fs');
let jsdom = require('jsdom');
let jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js');

let Couchtuner = function(base) {
  this.base = base;
};

let jsdomEnv = function(url) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      url: url,
      src: [jquery],
      done: (err, window) => {
        if(err) return reject(err);

        return resolve(window.$);
      }
    });
  });
};

Couchtuner.prototype.scrapeTV = function(rel) {
  return jsdomEnv(this.base + rel).then(($) => {
    return $('div[style="width: 160px; padding-right: 20px; float: left;"] > ul > li > strong > a')
              .map((anchor) => {
                return {
                  name:anchor.innerHTML,
                  link:anchor.href
                };
              });
  });
};

Couchtuner.prototype.scrapeEpisodes = function(rel) {
  return jsdomEnv(this.base + rel).then(($) => {
    let missed = [];
    let episodes = $('.entry > ul > li > strong > a').map((i, anchor) => {
      let name = anchor.innerHTML;
      let link = anchor.href;

      let matches = name.match(/.+[Ss](?:eason)?\s?(\d+)\s?[Ee](?:pisode)?\s?(\d+)/);
      if(matches === null) {
        missed.push({
          name:name,
          link:link
        });
        return;
      }

      return {
        link:link,
        season:matches[1],
        episode:matches[2]
      };
    });

    return { episodes, missed };

  });
}

module.exports = Couchtuner;
