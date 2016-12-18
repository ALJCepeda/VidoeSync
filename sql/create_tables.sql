CREATE DATABASE "libertytv"
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;

\c libertytv;

CREATE TABLE couchtuner_listings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  href TEXT NOT NULL UNIQUE,
  synced BOOLEAN
);

CREATE TABLE couchtuner_episodes (
  id SERIAL PRIMARY KEY,
  listings_id INT REFERENCES couchtuner_listings(id),
  season INT,
  episode INT,
  href TEXT UNIQUE,
  CONSTRAINT season_episode UNIQUE(season, episode)
);
