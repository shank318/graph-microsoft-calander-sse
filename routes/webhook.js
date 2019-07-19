	var express = require('express');
	var http = require('http');
	var router = express.Router();
	var graph = require('@microsoft/microsoft-graph-client');
	var cache = require('memory-cache');
	var subscription = require('./subscriptions')
	var subscribeConfig = require('../constants')

	router.post('/', async function(req, res, next) {
	  let status;
	  let clientStatesValid;

	  if (req.query && req.query.validationToken) {
	    res.send(req.query.validationToken);
	    // Send a status of 'Ok'
	    status = 200;
	  } else {
	  	clientStatesValid = false;

	  	// First, validate all the clientState values in array
	    for (let i = 0; i < req.body.value.length; i++) {
	      const clientStateValueExpected = subscribeConfig.subscriptionConfiguration.clientState;

	      if (req.body.value[i].clientState !== clientStateValueExpected) {
	        // If just one clientState is invalid, we discard the whole batch
	        clientStatesValid = false;
	        break;
	      } else {
	        clientStatesValid = true;
	      }
	    }

	    // If all the clientStates are valid, then process the notification
	    if (clientStatesValid) {
	      for (let i = 0; i < req.body.value.length; i++) {
	        const resource = req.body.value[i].resource;
	        const subscriptionId = req.body.value[i].subscriptionId;
	        processNotification(subscriptionId, resource, next);
	      }
	      // Send a status of 'Accepted'
	      status = 202;
	    } else {
	      // Since the clientState field doesn't have the expected value,
	      // this request might NOT come from Microsoft Graph.
	      // However, you should still return the same status that you'd
	      // return to Microsoft Graph to not alert possible impostors
	      // that you have discovered them.
	      status = 202;
	    }
	  }
	  res.status(status).end(http.STATUS_CODES[status]);
	  
	});


	// Get subscription data from the database
	// Retrieve the actual mail message data from Office 365.
	// Send the message data to the socket.
	async function processNotification(subscriptionId, resource, next) {
	  const subDats = cache.get(subscriptionId);
	  if (subDats==null){
	  	 return
	  }
	  console.log("Getting the subscription data from id::"+subscriptionId)
	  console.log(subDats)
	  console.log("Calling resourse"+resource)
	  const client = graph.Client.init({
	      authProvider: (done) => {
		        done(null, subDats.token);
	      }
	    });
	    try {
	      const result = await client
	      .api(resource)
	      .get();

	      console.log('data from Push event:')
	      console.log(result)

	      sendEvent(result);

	    } catch (err) {
	      console.log("Webhook notification::Failed")	
	      console.log(JSON.stringify(err.body, null, 2))
	    }
	}

	function sendEvent(event) {
		for (var i = 0; i < subscription.openConnections.length; i++) {
	    	subscription.openConnections[i].emit('update', event);
	  		}
	}

	module.exports = router;