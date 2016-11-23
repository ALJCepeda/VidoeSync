let pg = require('pg');
let Couchtuner = require('./syncers/couchtuner');

let pool = new pg.Pool({
  user: 'alfred',
  database: 'libertytv',
  host: 'localhost',
  port: 5432,
  max: 2,
  idleTimeoutMillis: 30000,
});

let couch = new Couchtuner(pool);
couch.syncTV().then(() => {
  console.log('Couchtuner tv shows synced');
  pool.end();
}).catch((err) => {
  console.log(err);
});
