'use strict';

const utils = require('../utils/utils');
// const Ticket = require('../models/ticket.model');

async function createTable( client, date ) {
  const schema = '_hour varchar(21), __num__ int PRIMARY KEY, _verified boolean, _owner varchar(255), _flag varchar(11), _pot int,_timestamp bigint'
  const query = `CREATE TABLE ${date} ( ${schema} )`
  client.query(query, function(err, result) {
    if(err) {
      return console.log('error creating table query', err);
    }
    console.log(`NEW TABLE ${date} ${utils.getTime()}`);
    return result;
  });
}

async function postTicket( client, date, ticket ) {
  const schema = "_hour, __num__, _verified, _owner, _flag, _pot, _timestamp";
  const query = `INSERT INTO ${date} ( ${schema} ) VALUES ( ${ticket} )`;
  client.query(query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(`NEW TICKET ${ticket} ${utils.getTime()}`);
    return result;
  });
}

async function getTickets( client, date ) {
  const query = `SELECT * FROM ${date}`;
  client.query(query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log('\n\n\neooo', result.rows);
    return result.rows;
  });
}

module.exports = {
  createTable,
  postTicket,
  getTickets
}
