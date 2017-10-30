'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("firebase.json"),
  databaseURL: "https://jarvis-d7a74.firebaseio.com"
});

var db = admin.database();
var messageRef = db.ref('messages')

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'M6G3I6LNMYAOXH37H2HSBRODCNKMEKIP') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// to post data
app.post('/webhook/', function (req, res) {
	console.log("got here!!!")

	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			console.log(event.message);
			let text = event.message.text
			var replies = event.message.quick_reply
			var newMessageRef = messageRef.push();
			if (replies !== undefined) {
				newMessageRef.set({"message": text, "sender": sender, "quick_reply": replies});
			}
			else {
				newMessageRef.set({"message": text, "sender": sender});
			}
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})

const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text, quick_replies) {
	let messageData = { text:text }
	console.log("Got here");
	console.log(messageData);

	if (quick_replies !== undefined) {
		console.log(quick_replies)
		messageData.quick_replies = quick_replies;
	}	
	else {
		console.log('no quick replies')
	}
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

var responseRef = db.ref('responses')

responseRef.on('child_added', function(data) {
	var message = data.val().message;
	var sender = data.val().sender;
	var quick_replies = data.val().quick_replies;

	sendTextMessage(sender, message, quick_replies);

	data.ref.remove()
});