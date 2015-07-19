'use latest';
'use strict';

const _ = require('lodash');
const request = require('request');

function roll(data, req, res){
  request({
    baseUrl: 'https://slack.com/api/',
    url: '/chat.postMessage',
    method: 'POST',
    json: true,
    form: {
      token: data.slack_bot_token,
      as_user: true,
      channel: data.channel_id,
      text: `@${data.user_name} rolled ${_.random(0, 100)}`
    }
  }, function(err, response, body){
    if(err || !body.ok){
      console.log('fail', err, body);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to send');
      return;
    }

    res.end();
  });
}

function ping(data, req, res){
  res.end('Pong! :100:');
}

function help(data, req, res){
  const msg = (`Currently available commands:
    * ping - pongs back (private)
    * roll - rolls a 100-sided die (public)
`);

  res.end(msg);
}

function task({ data }, req, res){

  if(data.token !== data.slack_command_token){
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Nope!');
    return;
  }

  const command = (data.text.split(' ')[0] || '').toLowerCase();

  switch(command){
    case 'ping':
      ping(data, req, res);
      break;
    case 'roll':
      roll(data, req, res);
      break;
    case 'commands':
    case 'help':
      help(data, req, res);
      break;
    default:
      res.end(`No command for '${command}' yet. Type '/icedbot help' for all commands.`);
  }
}

module.exports = task;
