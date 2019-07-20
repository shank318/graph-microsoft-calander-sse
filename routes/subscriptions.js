var authHelper = require('../helpers/auth');
var moment = require('moment');
var graph = require('@microsoft/microsoft-graph-client');
var cache = require('memory-cache');
var subscribeConfig = require('../constants')

var openConnections = [];


/* Subscribe to Microsoft events */
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

/* Subscribe and cache the result */
// TODO :: Can be saved in DB instead
async function subscribeAndCache(accessToken, res) {
      const sub  = await subscribe(accessToken)
      sub.token = accessToken;
      // Save subscription in cookie 
      res.cookie('subscription', sub, {maxAge: 3600000, httpOnly: true});
      cache.put(sub.id, sub);
}

exports.subscribeAndCache = subscribeAndCache;
exports.openConnections = openConnections;
exports.subscribe = subscribe;