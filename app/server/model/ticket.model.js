'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ticketSchema = new Schema({
  date: Date,
  hour: String,
  wallet: String,
  number: Number,
  verified: Boolean,
  country: String,
  flag: String,
  twitter: String
}, { timestamps: true },
);

module.exports =  mongoose.model('ticket', ticketSchema);
