	var express = require('express');
	var http = require('http');
	var router = express.Router();
	var graph = require('@microsoft/microsoft-graph-client');
	var cache = require('memory-cache');
	var subscription = require('./subscriptions')
	var subscribeConfig = require('../constants')


    /* Webhook endpoint*/
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
	        processNotification(req.body.value[i]);
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


	// Get subscription data from the cache
	// Retrieve the actual event from the calendar api.
	// Send the event data to the client via SSE.
	async function processNotification(notification) {
	  const subDats = cache.get(notification.subscriptionId);
	  if (subDats==null){
	  	 return
	  }
	  console.log("Getting the subscription data from id:: "+notification.subscriptionId+" changeType:: "+notification.changeType)
	  console.log(subDats)

	  if (notification.changeType === 'deleted') {
	  	 notification.id = notification.resourceData.id;
	  	 sendEvent(notification);
	  	 return;
	  }
	  console.log("Calling resourse"+notification.resource)

	  const client = graph.Client.init({
	      authProvider: (done) => {
		        done(null, subDats.token);
	      }
	    });
	    try {
	      const result = await client
	      .api(notification.resource)
	      .get();

	      console.log('data from Push event:')
	      result.changeType = notification.changeType
	      console.log(result);
	     
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