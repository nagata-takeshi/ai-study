var builder = require('botbuilder');
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var forecast = require('weather-yahoo-jp').forecast;
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=4fcf3965-0fce-44c6-b072-e078b85f95b7&subscription-key=033428336fd540aca26ab6f088d69f09');
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
var bot = new builder.UniversalBot(connector);
bot.dialog('/', intents);
process.on('uncaughtException',function(err){session.endDialog('aaa');});
intents.matches('isWeather',
    function (session, args) {
        var city = builder.EntityRecognizer.findEntity(args.entities, 'City');
        var day = builder.EntityRecognizer.findEntity(args.entities, 'Day');
		var forecastResult = "";
		var resultText = "";
		var forecastArea = "";
    }
)
.onDefault(function (session) { session.endDialog("日本語でok") });

