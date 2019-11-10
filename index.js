var express = require('express')
  , request = require('request')
  , key = require('./key.json')
  , multer  = require('multer');

var app = express();
var upload = multer({ dest: '/tmp/' });

var key = '/with/key/' + key.key;
var ifttt_url = 'https://maker.ifttt.com/trigger/';

app.post('/', upload.single('thumb'), function (req, res) {
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload.event);

  var options = {
    method: 'PUT',
    json: true,
  };

  //Ensure IFTTT's Maker channel is set to digest Plex.Play, Plex.Resume, ... events
  //If you want to control lights in particular 'Plex Rooms' you can look into payload.Player.title to send a custom event based on the player (ensure you have a unique name for each player configured in Plex).
  switch (payload.event) {
  case 'media.play':  
    // Trigger IFTTT_Plex.Play
    console.log('IFTTT_Plex.Play');
    options.url = ifttt_url + 'Plex.Play' + key;
    //options.body = { value1: payload.Account.title, value2: payload.Metadata.title, value3: payload.Player.title };
    //request(options);
    break;
  case 'media.resume':
    // Trigger IFTTT_Plex.Resume
    console.log('IFTTT_Plex.Resume');
    options.url = ifttt_url + 'Plex.Resume' + key;
    //request(options);
    break;
  case 'media.pause':
    // Trigger IFTTT_Plex.Pause
    console.log('IFTTT_Plex.Pause');
    options.url = ifttt_url + 'Plex.Pause' + key;
    //request(options);
    break;
  case 'media.stop':
    // Trigger IFTTT_Plex.Stop
    console.log('IFTTT_Plex.Stop');
    options.url = ifttt_url + 'Plex.Stop' + key;
    //request(options);
    break;
  }

	//value 1 - Account title? = rtbrown560
	//value 2 - Player title = chromecast
	//value 3 - Media title

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

  if (payload.Account.title == 'rtbrown560' && payload.Player.title == 'Chromecast') {
    request(options);
  }

  res.sendStatus(200);
});

app.listen(12000);
