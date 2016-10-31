
var restify = require('restify');
var builder = require('botbuilder');
//var request = require('superagent');
var request = require('request');

//request.get("http://httpbin.org/html")
//       .end(function(res){
//            console.log(res);
//       });

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
        if (syouhin) {
//            request.post("https://ussouthcentral.services.azureml.net/workspaces/ad3872017e32497e8ee877d6011ca157/services/06bfe516cd9247eb828b16cef814664a/execute?api-version=2.0&details=true")
//                .set('Content-Type', 'application/json')
//                .set('Authorization', 'Bearer rfpRykhDtQ9hmPFvidOHlXPW9Me61diB+VzXFy1Q9kU5JJv86qZB3sMoz3E35M0PCK4KB0CEzBJfPmNtYhWSFw==')
//                .set('Content-Length', '47')
//                .send({"Inputs": {"input1": {"ColumnNames": ["メーカー","燃料タイプ","ドアの数","車体形状","エンジンの場所","エンジンサイズ","値段"],"Values": [[“toyota",“gas",“two",“sedan",“front",“200","0"]]}},"GlobalParameters": {}})
//                .end(function(res){
//                   console.log(res);
//                });

              var options = {
                  url: 'https://ussouthcentral.services.azureml.net/workspaces/ad3872017e32497e8ee877d6011ca157/services/06bfe516cd9247eb828b16cef814664a/execute?api-version=2.0&details=true',
                  method: 'POST',
                  headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer rfpRykhDtQ9hmPFvidOHlXPW9Me61diB+VzXFy1Q9kU5JJv86qZB3sMoz3E35M0PCK4KB0CEzBJfPmNtYhWSFw==')},
                  json: {'Inputs': {'input1': {'ColumnNames': ["メーカー","燃料タイプ","ドアの数","車体形状","エンジンの場所","エンジンサイズ","値段"],'Values': [["toyota","gas","two","sedan","front","200","0"]]}},'GlobalParameters': {}}
              }
              request(options, function(error, response, body) {
                  session.send("body.name:" + body.name);
              })
            //  session.send(syouhin.entity + "の市場価格ですね");
        } else {
            session.send("test");
        }
     })


