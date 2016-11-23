let Scraper = require('../scrapers/couchtuner');

let Couchtuner = function(pool) {
  this.scraper = new Scraper('http://www.couch-tuner.ag/');
  this.pool = pool;
};

Couchtuner.prototype.syncListings = function() {
  return this.scraper.scrapeMovies('tv-lists').then((anchors) => {
    var chain = Promise.resolve();

    anchors.forEach((anchor) => {
      chain = chain.then(() => {
        return new Promise((resolve, reject) => {
          this.pool.connect((err, client, done) => {
            if(err) return reject(err);

            client.query('INSERT INTO couchtuner_listings(name, href) VALUES($1, $2)', [anchor.name, anchor.link], (err, res) => {
              if(err) return reject(err);

              console.log('Inserted:', anchor.name);
              done();
              return resolve(res);
            });
          });
        });
      });
    });

    return chain;
  });
};

module.exports = Couchtuner;
