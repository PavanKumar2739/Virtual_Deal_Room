const { Redis } = require("ioredis");

const client = new Redis();//hit bydefault 66347 redies server

module.exports = client;