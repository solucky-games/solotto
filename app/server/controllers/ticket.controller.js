'use strict';

// const Ticket = require('../models/ticket.model');

function createTable() {
  const date = utils.getDateSQL();
  const schema = 'id int PRIMARY KEY, owner varchar(255), flag varchar(50), hour varchar(50), timestamp int'
  const query = `CREATE TABLE ${date} ( ${schema} )`
  client.query(query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result);

  });
}

function insertTicket( client, ticket ) {
  const date = getDateSQL();
  const schema = "id, owner, flag, hour, timestamp";
  const values = "33, 'jhkjadhkjahjksa', '🇪🇸', '03:21', 3290923";
  const query = `INSERT INTO ${date} ( ${schema} ) VALUES ( ${values} )`;
  client.query(query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }

  });
}

function getTickets() {

  const date = utils.getDateSQL();
  const query = `SELECT * FROM ${date}`;
  client.query(query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log('\n\n\n', result.rows);
  });

}

module.exports = {
  createTable,
  insertTicket,
  getTickets
}
