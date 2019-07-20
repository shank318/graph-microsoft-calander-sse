# graph-microsoft-calander-sse

## Introduction
<a name="introduction"></a>

This Node.js sample does the following.

- Sign-in with microsoft Oauth login.
- Pulls down existing calendar **(last 7 days)** events displays on web page.
- Allows you to update the events and pushes the update back to the server.
- Implement a webhook such that when something is changed on outlook.com you get the update on your local web page using SSE.
- Read more about SSE [here](https://medium.com/@moinism/using-nodejs-for-uni-directional-event-streaming-sse-c80538e6e82e)

## Live demo

- [Calendar app](https://calendar-sse-app.herokuapp.com)

## Prerequisites
<a name="prerequisites"></a>

To use the Webhook sample, you need the following:

- [Node.js](https://nodejs.org/) version 4 or 5.
- [Follow this sample doc](https://docs.microsoft.com/en-us/outlook/rest/node-tutorial)
- [Handlebar.js](https://handlebarsjs.com/)


## Setup on localhost

The sample uses heroku as the development server. If you want to run this app on localhost you have to change the following.

1. In .env file change the ```REDIRECT_URI=http://localhost:3000/autorize``` 
2. Setup tunnel for receving webooks on localhost

we need a tunnel that can forward requests from a URL on the Internet to your localhost. If for any reason, you don't want to use a tunnel, see [Hosting without a tunnel](https://github.com/OfficeDev/Microsoft-Graph-Nodejs-Webhooks/wiki/Hosting-the-sample-without-a-tunnel). If you want a detailed explanation about why to use a tunnel, see [Why do I have to use a tunnel?](https://github.com/OfficeDev/Microsoft-Graph-Nodejs-Webhooks/wiki/Why-do-I-have-to-use-a-tunnel)

For this sample, we use [ngrok](https://ngrok.com/) to create the tunnel. To configure ngrok:

1. [Download](https://ngrok.com/download) and unzip the ngrok binaries for your platform.
1. Type the following command:

    ```Shell
    ngrok http 3000
    ```

1. Take note of the *https public URL* that ngrok provides for you. This is an example:

    ```http
    https://{NGROK_ID}.ngrok.io
    ```

You'll need the `NGROK_ID` value in the next section.

## Configure and run the web app
2. open `constants.js` and change the  `notificationUrl=https://{NGROK_ID}.ngrok.io/webhook` 

1. Install the dependencies running the following command:

    ```Shell
    npm install
    ```

1. Start the application with the following command:

    ```Shell
    npm start
    ```
    > **Note:** You can also make the application wait for a debugger. To wait for a debugger, use the following command instead:
    >
    > ```Shell
    > npm run debug
    > ```
    > You can also attach the debugger included in Microsoft Visual Studio Code. For more information, see [Debugging in Visual Studio Code](https://code.visualstudio.com/Docs/editor/debugging).

1. Open a browser and go to [http://localhost:3000](http://localhost:3000).

## TODO list
1. Replace the in-memory cache with database to store the subscriptions.
2. I am storing the subscription data in cookie and updaing the in-memory cache on every page reload.(This is a kind of hack which will be solved after implementing the database)

## Improvements
Currently the Backend and frontend are tied to each other, backend can be separated and frontend can talk to it via rest API.

