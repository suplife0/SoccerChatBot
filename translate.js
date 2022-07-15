var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN =  't0DOzXzztYMAAGKj2h55uu09BYXkYqQe90lyln4m2pH+W6orI6hlJKOa4+j2NMcRvEqErZ6FNs2nvMDIYwLc6lat7A2tAUlFXbR3E+RNmZ5RTbUXkdlbsnbm2rBIODnJkwhRxxspZbQlsd+ObmYSQwdB04t89/1O/w1cDnyilFU='
const PAPAGO_URL = 'https://openapi.naver.com/v1/papago/n2mt'
const PAPAGO_ID = 'UZMyxEhDtcZQ4JNNeohy'
const PAPAGO_SECRET = 'J2yR82NwYK'
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "2018102191.osschatbot2022.tk"
const sslport = 23023;
const bodyParser = require('body-parser');

var language = "en";

var app = express();
app.use(bodyParser.json());
app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    trans(eventObj.replyToken, eventObj.message.text);
    

    res.sendStatus(200);
});

function trans(replyToken, message) {
    console.log(message);
    switch(message)
    {
        case "영어":
            language = "en";
            console.log("영어로 변경");
            return;
            break;
        case "일본어":
            language = "ja";
            console.log("일본어로 변경");
            return;
            break;
        case "프랑스어":
            language = "fr";
            console.log("프랑스어로 변경");
            return;
            break;
        default:
            break;
    }

    request.post(
        {
            url: PAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: 'source=ko&target=' + language + '&text=' + message,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.message);
                var transMessage = body.message.result.translatedText;
                request.post(
                    {
                        url: TARGET_URL,
                        headers: {
                            'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken":replyToken,
                            "messages":[
                                {
                                    "type":"text",
                                    "text":transMessage
                                }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            }
        });

}

try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
  
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
  }
  