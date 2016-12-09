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

tape('syncListings', (t) => {
  couch.syncListings().then((result) => {
    console.log(result);
  }).catch(t.fail).then(t.end);
});
