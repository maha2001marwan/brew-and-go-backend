'use strict';
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5-min default TTL

module.exports = {
  get:   (key)            => cache.get(key),
  set:   (key, val, ttl)  => cache.set(key, val, ttl ?? 300),
  del:   (key)            => cache.del(key),
  flush: ()               => cache.flushAll(),
  keys:  ()               => cache.keys(),
  stats: ()               => cache.getStats(),
};
