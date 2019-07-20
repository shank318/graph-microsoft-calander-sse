exports.subscriptionConfiguration = {
  changeType: "Created,Updated,Deleted",
  notificationUrl: "https://calendar-sse-app.herokuapp.com/webhook",
  resource: "/me/events",
  clientState: "cLIENTsTATEfORvALIDATION"
};