
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

//ボットの仕組みを提供してくれるUniversalBotオブジェクトを提供する
var bot = new builder.UniversalBot(connector);

// エンドポイントとしてボットをサーバで提供する
server.post('/api/messages', connector.listen());

// 認識に指定するluis apiのurlを指定
var url = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID
        + '&subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY
var recognizer = new builder.LuisRecognizer(url);

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});


//=========================================================
// Bots Dialogs
//=========================================================

// 初期ダイアログをintentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents
     .matches('price-forecastiong', function (session, args) {
        var syouhin = builder.EntityRecognizer.findEntity(args.entities, '商品');
        session.send("はい、" + syouhin.entity + "の市場価格ですね");
     })


