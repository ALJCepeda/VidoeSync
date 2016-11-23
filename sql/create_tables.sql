CREATE DATABASE "libertytv"
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;

\c libertytv;

CREATE TABLE couchtuner_listings (
  name TEXT PRIMARY KEY,
  href TEXT
);
