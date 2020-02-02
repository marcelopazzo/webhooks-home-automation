#!/usr/bin/env node

var express = require('express')
  , request = require('request')
  , config  = require('./config.json')
  , multer  = require('multer');

var app = express();
var upload = multer({ dest: '/tmp/' });

var key = '/with/key/' + config.key;
var username = config.username;
var ifttt_url = 'https://maker.ifttt.com/trigger/';

app.post('/', upload.single('thumb'), function (req, res) {
  var now = new Date();
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload.event);


  if (config[payload.Player.title] == undefined) {
    console.log('No settings for this device');
    return res.sendStatus(200);
  }

  var device_settings = config[payload.Player.title]

  var events = device_settings.events;

  var hour = now.getHours();
  var start_hour = device_settings.start_hour;
  var end_hour = device_settings.end_hour;

  if (start_hour && start_hour > hour && end_hour && end_hour <= hour) {
    console.log('Device should not be triggered at this time');
    return res.sendStatus(200);
  }

  var options = {
    method: 'PUT',
    json: true,
  };

  if (events[payload.event]) {
    console.log('IFTTT event: ', events[payload.event]);
    options.url = ifttt_url + events[payload.event] + key;
  } else {
    console.log('Event not set up');
    return res.sendStatus(200);
  }

  switch (payload.Metadata.librarySectionType) {
    case 'show':
      options.body = { value1: payload.Account.title, value2: payload.Player.title, value3: (payload.Metadata.grandparentTitle + ' - ' + payload.Metadata.title) };
      break;
    case 'movie':
      options.body = { value1: payload.Account.title, value2: payload.Player.title, value3: payload.Metadata.title };
      break;
    case 'artist':
      options.body = { value1: payload.Account.title, value2: payload.Player.title, value3: (payload.Metadata.grandparentTitle + ' - ' + payload.Metadata.parentTitle + ' - ' + payload.Metadata.title) };
      break;
    default:
  }

  // Only submitting the request for username in config file
  if (payload.Account.title == username) {
    request(options);
  }

  res.sendStatus(200);
});

app.listen(12000);
