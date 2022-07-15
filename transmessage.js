var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'XOyIf8jsoQKq3b1zqxE4wawAoFU2Hz433AO3w8/ye+i6+2KrXpyfFwY0Dk/xhHQLPgtgPTiEP/m4IRW+SlVhdtzfH6c0Lfdw6nJ95QOugHfNWfviAmn5Uojh8LQJeAy21bvaNMCy11f+qgLSRnXmCgdB04t89/1O/w1cDnyilFU='
const PAPAGO_URL = 'https://openapi.naver.com/v1/papago/n2mt'
const PAPAGO_ID = 'UZMyxEhDtcZQ4JNNeohy'
const PAPAGO_SECRET = 'J2yR82NwYK'
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "2018102191.osschatbot2022.tk"
const sslport = 23023;
const bodyParser = require('body-parser');
const { post } = require('request');
const req = require('express/lib/request');

function transMsg(replyMsg, callbackFunc){
    var language = "ko";
    
    request.post(
        {
            url: PAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: 'source=en&target=' + language + '&text=' + replyMsg,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                let transMessage = body.message.result.translatedText;
                console.log(transMessage);  
                callbackFunc(transMessage);
            }
        });
    }

function transMsg_toEn(replyMsg, callbackFunc){
    var language = "en";

    request.post(
        {
            url: PAPAGO_URL,
            method : post,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: 'source=ko&target=' + language + '&text=' + replyMsg,
            json:true
        }, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                let transMessage = body.message.result.translatedText;
                console.log(transMessage); 
                callbackFunc(transMessage);
            }
        });
}    

exports.TranslateKRtoEN = function(transMsg, callbackFunc){
    transMsg_toEn(transMsg, callbackFunc);
}

exports.TranslateENtoKR = function(transMsg, callbackFunc){
    transMsg(transMsg, callbackFunc);
}

