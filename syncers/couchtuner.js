let Scraper = require('../scrapers/couchtuner');

let Couchtuner = function(pool) {
  this.scraper = new Scraper();
  this.pool = pool;
};

Couchtuner.prototype.syncListings = function() {
  return this.scraper.scrapeListings('http://www.couch-tuner.ag/tv-lists').then((anchors) => {
    var chain = Promise.resolve([]);

    anchors.forEach((anchor) => {
      chain = chain.then((listings) => {
        return new Promise((resolve, reject) => {
          this.pool.connect((err, client, done) => {
            if(err) return reject(err);

            client.query(`INSERT INTO couchtuner_listings(name, href)
                          VALUES($1, $2)
                          ON CONFLICT(name) DO UPDATE SET
                            href=$2
                          RETURNING id`, [anchor.name, anchor.link], (err, res) => {
              if(err) return reject(err);

              listings.push({
                id:res.rows[0].id,
                name:anchor.name
                href:anchor.href
              });
              done();
              return resolve(listings);
            });
          });
        });
      });
    });

    return chain;
  });
};

Couchtuner.prototype.fetchListings = function() {
  return new Promise((resolve, reject) => {
    this.pool.connect((err, client, done) => {
      if(err) reject(err);

      client.query('SELECT id, name, href FROM couchtuner_listings', (err, res) => {
        if(err) return reject(err);

        return resolve(res.rows.map((row) => {
          return {id:row.id, name:row.name, href:row.href};
        }));
      });
    });
  });
};

Couchtuner.prototype.syncEpisodes = function(listings) {
  var sync;
  if(typeof listings === 'undefined') {
    sync = this.fetchListings();
  } else {
    sync = Promise.resolve(listings);
  }

  return sync.then((listings) => {
    console.log(listings);
  });
}

module.exports = Couchtuner;
