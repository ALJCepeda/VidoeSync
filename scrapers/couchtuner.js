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
    let columns = $("div[style='width: 160px; padding-right: 20px; float: left;']");

    let anchors = [];
    columns.each((i, column) => {
      let anchorTags = $(column).find('ul > li > strong > a');

      anchorTags.each((i, anchorTag) => {
        anchors.push({
          name:anchorTag.innerHTML,
          link:anchorTag.href
        });
      });
    });

    return anchors;
  });
};

Couchtuner.prototype.scrapeEpisodes = function(rel) {
  return jsdomEnv(this.base + rel).then(($) => {
    let anchors = $('.entry > ul > li > strong > a');

    return anchors.map((i, anchor) => {
      let name = anchor.innerHTML;
      let link = anchor.href;

      let matches = name.match(/.+[Ss](?:eason)?\s?(\d+)\s?[Ee](?:pisode)?\s?(\d+)/);
      if(matches === null) {
        return;
      }

      return {
        link:link,
        season:matches[1],
        episode:matches[2]
      };
    });
  });
}

module.exports = Couchtuner;
