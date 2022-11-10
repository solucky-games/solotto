'use strict';

function formatTime (num) {
  if (String(num).length < 2) 
    return '0' + String(num);
  else if (String(num).length < 1) 
    return '00';
  return String(num);
}

function getTime () {
  const date = new Date
  const hours = formatTime(date.getUTCHours());
  const minutes = formatTime(date.getMinutes());
  const seconds = formatTime(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function getDate () {
  const date = new Date
  const year = formatTime(date.getUTCFullYear());
  const month = formatTime(date.getUTCMonth()+1);
  const day = formatTime(date.getUTCDate());
  return `${year}-${month}-${day}`;
}

function getDateSQL () {
  const date = new Date
  const year = formatTime(date.getUTCFullYear());
  const month = formatTime(date.getUTCMonth()+1);
  const day = formatTime(date.getUTCDate());
  return `_${year}_${month}_${day}_`;
}

function countDown () {
  const time = getTime().split(':');
  const hours = formatTime(23-time[0]);
  const minutes = formatTime(59-time[1]);
  const seconds = formatTime(59-time[2]);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function nPlayers ( tickets ) {
  const uniqueWallets = [];
  for (const ticket of tickets) {
    if ( uniqueWallets.includes(ticket._owner)  )
      continue;
    else
      uniqueWallets.push(ticket._owner);
  }
  return uniqueWallets.length;
}


module.exports = {
  formatTime,
  getTime,
  getDate,
  getDateSQL,
  countDown,
  nPlayers
}
