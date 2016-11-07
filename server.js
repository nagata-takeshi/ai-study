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
        if (city) {
			forecastArea = city.entity.replace(/\s+/g,"");
			forecast.get(forecastArea).then(function(forecast) {
				if (day) {
					if (day.entity == '明日' || day.entity == 'あした' || day.entity == 'あす') {
						forecastResult = forecast.tomorrow.text;
						resultText += '明日の';
					} else if (day.entity == '今日' || day.entity == '本日' || day.entity == 'きょう') {
						forecastResult = forecast.today.text;
						resultText += '今日の';
					} else {
						session.endDialog("今日か明日の天気しかわかりませんが何か？万能じゃないんで。");
					}
					resultText += forecast.where + "の天気は" + forecastResult + "なんじゃない？あとは気象庁に聞いてくれ。";
					session.endDialog(resultText);
				} else {
					session.endDialog("今日か明日くらい言ってくれてもいいんじゃない？");
				}
			}).catch(function(err) {
				session.endDialog("何故か例外をキャッチしたよ。ぼく死ぬのかな？");
			});
		} else {
			session.endDialog("都道府県ぐらい言ってほしいもんだ。");
		}
    }
)
.matches('getWeather', [
    function (session, args) {
        var city = builder.EntityRecognizer.findEntity(args.entities, 'City');
        var day = builder.EntityRecognizer.findEntity(args.entities, 'Day');
		var forecastResult = "";
		var resultText = "";
		var forecastArea = "";
        if (city) {
			forecastArea = city.entity.replace(/\s+/g,"");
			forecast.get(forecastArea).then(function(forecast) {
				if (day) {
					if (day.entity == '明日' || day.entity == 'あした' || day.entity == 'あす') {
						forecastResult = forecast.tomorrow.text;
						resultText += '明日の';
					} else if (day.entity == '今日' || day.entity == '本日' || day.entity == 'きょう') {
						forecastResult = forecast.today.text;
						resultText += '今日の';
					} else {
						session.endDialog("今日か明日の天気しかわかりませんが何か？万能じゃないんで。");
					}
					resultText += forecast.where + "の天気は" + forecastResult + "だと思うよ。勘だけども。";
					session.endDialog(resultText);
				} else {
					session.endDialog("今日か明日くらい言ってくれてもいいんじゃない？");
				}
			}).catch(function(err) {
				session.endDialog("何故か例外をキャッチしたよ。ぼく死ぬのかな？");
			});
		} else {
			session.endDialog("都道府県ぐらい言ってほしいもんだ。");
		}
    }
])
.matches('whois', [
    function (session, args) {
		session.endDialog("はじめまして僕はbot。名前はまだない。日本の天気に詳しいよ。");
	}
])
.matches('replyHello', [
    function (session, args) {
		var greet = builder.EntityRecognizer.findEntity(args.entities, 'Greetings');
		if (greet) {
			session.endDialog(greet.entity.replace(/\s+/g,"") + "。");
		} else {
			session.endDialog("ん？よ、よお。（。。。よくわからないけど挨拶っぽい）");
		}
	}
])
.matches('replyGoodBye', [
    function (session, args) {
		var greet = builder.EntityRecognizer.findEntity(args.entities, 'Greetings');
		if (greet) {
			session.endDialog(greet.entity.replace(/\s+/g,"") + "。天気が知りたくなったらまた呼んでロボ。");
		} else {
			session.endDialog("別れの挨拶を言われている気がする。ではまたね。");
		}
	}
])
.onDefault(function (session) { session.endDialog("日本語でok") });

