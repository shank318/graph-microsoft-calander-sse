var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var subscriptionObj = require('./subscriptions')
var cache = require('memory-cache');
var graph = require('@microsoft/microsoft-graph-client');

/* GET /calendar */
router.get('/', async function(req, res, next) {
  let parms = { title: 'Calendar', active: { calendar: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    // Update the cache :: Will be required while webhook calls
    let subscription = req.cookies.subscription;
    if (subscription != null){
      cache.put(subscription.id, subscription);
    }else{
       await subscriptionObj.subscribeAndCache(accessToken,res);
    }

    parms.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    // Set start of the calendar view to today at midnight
    const start = new Date(new Date().setHours(0,0,0));
    // Set end of the calendar view to 7 days from start
    const end = new Date(new Date(start).setDate(start.getDate() + 7));

    try {
      // Get the first 10 events for the coming week
      const result = await client
      .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
      .top(10)
      .select('id,subject,start,end,attendees')
      .orderby('start/dateTime DESC')
      .get();

      parms.events = result.value;

      res.render('calendar', parms);
    } catch (err) {
      parms.message = 'Error retrieving events';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }

  } else {
    // Redirect to home
    res.redirect('/');
  }
});

router.post('/edit', async function(req, res, next) {
  let parms = { title: 'Calendar', active: { calendar: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;

    const updateEvent = {
      subject : req.body.subject
    }
    console.log(updateEvent)
    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
    
    try {
      // Get the first 10 events for the coming week
      const result = await client
      .api('/me/events/'+req.body.event_id)
      .update(updateEvent);
      res.redirect('/calendar');
    } catch (err) {
      parms.message = 'Error retrieving events';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }

  } else {
    // Redirect to home
    res.redirect('/');
  }
});

module.exports = router;