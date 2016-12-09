let Scraper = require('../scrapers/couchtuner');

let Couchtuner = function(pool) {
  this.scraper = new Scraper();
  this.pool = pool;
};

Couchtuner.prototype.syncListings = function() {
  return this.scraper.scrapeListings('http://www.couch-tuner.ag/tv-lists').then((anchors) => {
    var chain = Promise.resolve([]);

    anchors.forEach((anchor) => {
      chain = chain.then((names) => {
        return new Promise((resolve, reject) => {
          this.pool.connect((err, client, done) => {
            if(err) return reject(err);

            client.query(`INSERT INTO couchtuner_listings(name, href)
                          VALUES($1, $2)
                          ON CONFLICT(name) DO UPDATE SET
                            href=$2
                          RETURNING id`, [anchor.name, anchor.link], (err, res) => {
              if(err) return reject(err);

              names.push({
                id:res.rows[0].id,
                name:anchor.name
              });
              done();
              return resolve(names);
            });
          });
        });
      });
    });

    return chain;
  });
};

module.exports = Couchtuner;
