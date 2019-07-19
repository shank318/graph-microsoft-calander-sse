var authHelper = require('../helpers/auth');
var moment = require('moment');
var graph = require('@microsoft/microsoft-graph-client');
var cache = require('memory-cache');
var subscribeConfig = require('../constants')

var openConnections = [];


async function subscribe(accessToken) {
  subscribeConfig.subscriptionConfiguration["expirationDateTime"] = new Date(Date.now() + 86400000).toISOString();
	const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    try {
      const result = await client
      .api('/subscriptions')
      .post(subscribeConfig.subscriptionConfiguration);

      console.log("Subscription::Success")
      console.log(result)
      return result;
    } catch (err) {
      console.log("Subscription::Failed")
      console.log(JSON.stringify(err.body, null, 2))
    }

    return null;

}

exports.openConnections = openConnections
exports.subscribe = subscribe;