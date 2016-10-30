
var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

var url = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID
        + '&subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY

var recognizer = new builder.LuisRecognizer(url);

var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});


//=========================================================
// Bots Dialogs
//=========================================================

//bot.dialog('/', function (session) {
//    session.send("Hello World update");
//});

bot.dialog('/', intents);

intents
     .matches('price-forecastiong', function (session, args) {
        var syouhin = builder.EntityRecognizer.findEntity(args.entities, '商品');
        session.send(syouhin + "の価格予測ですね");
     })

//dialog.on('price-forecastiong', function(session, args){
//   consol.log('message:');
//   consol.log(session.message);

//   session.send('price-forecastiong!!');
//});



