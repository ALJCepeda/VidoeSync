let fs = require('fs');
let jsdom = require('jsdom');
let jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js');

let Couchtuner = function(base) {
  this.base = base;
}

Couchtuner.prototype.scrapeTV = function(rel) {
  let url = this.base + rel;

  return new Promise((resolve, reject) => {
    jsdom.env({
      url: url,
      src: [jquery],
      done: (err, window) => {
        if(err) return reject(err);
        let $ = window.$;
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

        return resolve(anchors);
      }
    });
  });
};
/*
Couchtuner.prototype.scrapeSeasons = function(rel) {
  let url = this.base + rel;

  return new Promise((resolve, reject) => {
    jsdom.env({
      url:''
    })
  });
}*/

module.exports = Couchtuner;
