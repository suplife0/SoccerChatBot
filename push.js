const { send } = require('express/lib/response');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/push'
const MULTI_TARGET_URL = 'https://api.line.me/v2/bot/message/multicast'
const BROAD_TARGET_URL = 'https://api.line.me/v2/bot/message/broadcast'
const TOKEN = 't0DOzXzztYMAAGKj2h55uu09BYXkYqQe90lyln4m2pH+W6orI6hlJKOa4+j2NMcRvEqErZ6FNs2nvMDIYwLc6lat7A2tAUlFXbR3E+RNmZ5RTbUXkdlbsnbm2rBIODnJkwhRxxspZbQlsd+ObmYSQwdB04t89/1O/w1cDnyilFU='
var USER_ID = 'Uc4258407a7677769f74ba184ec036651'

//Single User


function SingleCast(sendMsg, destination){

    USER_ID = destination;

    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "to": `${USER_ID}`,
                "messages":[
                    {
                        "type":"text",
                        "text":sendMsg
                    },
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

// Multicast User

function Multicast(sendMsg){
    request.post(
        {
            url: MULTI_TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "to": [`${USER_ID}`],
                "messages":[
                    {
                        "type":"text",
                        "text":sendMsg
                    },
                    {
                        "type":"text",
                        "text":"May I help you?"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function Broadcast(msg){
    request.post(
        {
            url: BROAD_TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "messages":[
                    {
                        "type":"text",
                        "text":msg
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

exports.SendMessage = function(sendMessage, destination){
    SingleCast(sendMessage, destination);
}