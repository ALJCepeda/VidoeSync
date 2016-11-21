let fs = require('fs');
let jsdom = require('jsdom');
let jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js');

var pg = require('pg');

var pool = new pg.Pool({
  user: 'alfred',
  database: 'couchtuner',
  host: 'localhost',
  port: 5432,
  max: 2,
  idleTimeoutMillis: 30000,
});

jsdom.env({
  url: "http://www.couch-tuner.ag/tv-lists/",
  src: [jquery],
  done: (err, window) => {
    var $ = window.$;
    var columns = $("div[style='width: 160px; padding-right: 20px; float: left;']");


    var chain = Promise.resolve();
    columns.each((i, column) => {
      var anchors = $(column).find('ul > li > strong > a');

      anchors.each((i, anchor) => {
        let name = anchor.innerHTML;
        let link = anchor.href;

        chain = chain.then(() => {
          return new Promise((resolve, reject) => {
            pool.connect((err, client, done) => {
              if(err) return reject(err);

              client.query('INSERT INTO movies(name, href) VALUES($1, $2)', [name, link], (err, res) => {
                if(err) return reject(err);

                console.log('Inserted:', name);
                done();
                return resolve(res);
              });
            });
          });
        });
      });
    });

    chain.then(() => {
      console.log('Inserts completed');
    });
  }
});
