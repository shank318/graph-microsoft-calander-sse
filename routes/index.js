  var express = require('express');
  var router = express.Router();
  var authHelper = require('../helpers/auth');
  var subscription = require('./subscriptions')

  /* GET home page. */
  router.get('/', async function(req, res, next) {
    let parms = { title: 'Home', active: { home: true } };

    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;

    if (accessToken && userName) {
      parms.user = userName;
      parms.debug = `User: ${userName}\nAccess Token: ${accessToken}`;
    } else {
      parms.signInUrl = authHelper.getAuthUrl();
      parms.debug = parms.signInUrl;
    }

    res.render('index', parms);
  });

  router.get('/events/', function (req, res) {
  	
  	res.writeHead(200, {
  		'Content-Type': 'text/event-stream', // <- Important headers
  		'Cache-Control': 'no-cache',
  		'Connection': 'keep-alive'
  	});
  	res.write('\n');

  	req.addListener('update', function(e) {
  		
      	res.write(`data: ${JSON.stringify(e)}\n\n`);
    	});

    	subscription.openConnections.push(req);

    	req.on('close', function() {
      for (var i = 0; i < subscription.openConnections.length; i++) {
        if (subscription.openConnections[i] == req) {
          subscription.openConnections.splice(i, 1);
          break;
        }
      }
    });

  });



  module.exports = router;