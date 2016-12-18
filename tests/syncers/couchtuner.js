let pg = require('pg');
let tape = require('tape');
let Couchtuner = require('../../syncers/couchtuner');

let pool = new pg.Pool({
  user: 'alfred',
  password: 'password123',
  database: 'libertytv',
  host: 'localhost',
  port: 5432,
  max: 2,
  idleTimeoutMillis: 30000,
});
let couch = new Couchtuner(pool);

tape.skip('syncListings', (t) => {
  couch.syncListings().then((listings) => {
    t.equal(
      listings.length,
      597,
      'Number of synced listings'
    );
  }).catch(t.fail).then(t.end);
});

tape('synceEpisodes', (t) => {
  couch.syncEpisodes().then(() => {
    t.pass('Synced all episodes');
  }).catch(t.fail).then(t.end);
});
