const _ = require('lodash');
const async = require('async');
const fetch = require('node-fetch');

const artists = [
  '7kZrDJdqo62iZD6B2UEu7D',
  '26dSoYclwsYLMAKD3tpOr4',
  '4Z8W4fKeB5YxbusRsdQVPb',
  '4ksCwAPgMi8rkQwwR3nMos',
  '1dfeR4HaWDbWqFHLkxsg1d',
  '0YC192cP3KPCRWx8zr8MfZ',
  '4dpARuHxo51G3z768sgnrY',
  '4lujXse2GVoN3RoTG3ZxZC',
  '3KGnRdVPGnRbL4oVSG7kFc',
  '4FpWLDzdJjx5kjgdvacqmY',
];

const url = 'https://api.spotify.com/v1/artists/';
const related = '/related-artists';
const tracks = '/top-tracks?country=FR';
const start = _.random(1, 5);

const selectedArtistsIds = () => {
  const selectedArtists = _.slice(artists, start);
  return selectedArtists;
};

const sortByPopularity = (tracks) => {
  return _.sortBy(tracks, track => track.popularity);
};

const selectedArtists = selectedArtistsIds();

const call = (artist, callback) => (
  async.waterfall([
    fetchRelatedArtists(artist),
    fetchTopTrack,
    ],
    callback
  )
);

const fetchRelatedArtists = (artist) => (callback) => (
  fetch(url + artist + related)
  .then(res => res.json())
  .then(json => callback(null, _.slice(json.artists, 0, 2)))
);

const fetchTopTrack = (artists, callback) => {
    async.map(artists, artist => {
    fetch(url + artist.id + tracks)
    .then(res => res.json())
    .then(json => (callback(null, _.slice(_.reverse(sortByPopularity(json.tracks)), 0, 1))));
  })
}

async.map(selectedArtists, call, (err, data) => console.log(_.slice(sortByPopularity(data), 0, 1)[0][0].name));






