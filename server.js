var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var forecast = require('weather-yahoo-jp').forecast;

e/=========================================================
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

//ボットの仕組みを提供してくれるUniversalBotオブジェクトを提供する
var bot = new builder.UniversalBot(connector);

// エンドポイントとしてボットをサーバで提供する
server.post('/api/messages', connector.listen());

// 認識に指定するluis apiのurlを指定
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=4fcf3965-0fce-44c6-b072-e078b85f95b7&subscription-key=033428336fd540aca26ab6f088d69f09');

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});


//=========================================================
// Bots Dialogs
//=========================================================

// 初期ダイアログをintentDialogとして使用する
