var express = require('express');
var tryParse = require('tryparse');
var papago = require('./transmessage.js');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply' // reply api
const TOKEN = 't0DOzXzztYMAAGKj2h55uu09BYXkYqQe90lyln4m2pH+W6orI6hlJKOa4+j2NMcRvEqErZ6FNs2nvMDIYwLc6lat7A2tAUlFXbR3E+RNmZ5RTbUXkdlbsnbm2rBIODnJkwhRxxspZbQlsd+ObmYSQwdB04t89/1O/w1cDnyilFU='
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
//const domain = "127.0.0.1";
const domain = "2018102191.osschatbot2022.tk"
const sslport = 23023;

var data = require('./getid.js');
var soccerAPI = require('./appfunctions.js');
var push = require('./push.js');

const bodyParser = require('body-parser');
const { defaultProxyHeaderExclusiveList } = require('request/request');

var isLeagueInfo = false;
var step = 0;

var currentLeagueID = 0;
var currentTeamID = 0;

//push.SendMessage(DefaultSelectMessage());

data.SetData();

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
    console.log("Receive Message : ", eventObj.message.text);

    SelectAPI(eventObj, eventObj.message.text);
    
    res.sendStatus(200);
});

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
    console.log('[HTTPS] HTTPS ????????? ?????????????????????. HTTPS ????????? ???????????? ????????????.');
    console.log(error);
  }

function Reply(eventObj,replyMsg){

    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}` // ???????????? : channel token ?????? ?????? ??????.
            },
            json: {
                "replyToken":eventObj.replyToken, // reply token : ???????????? ?????? ????????????? ???????????? ??????!
                "messages":[
                    {
                        "type":"text",
                        "text":replyMsg
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body);
            if(step == 2){
                SetDefault(eventObj.source.userId);
            }
        });
}

function GetPlayerInfo(playerID, season, eventObj){
    var request = require('request');
    var options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/players',  
        qs: {id: playerID, season: season},
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
        }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      Reply(eventObj,response.body);
    });
}


function SelectAPI(eventObj, commingMsg){
    console.log("Step : " + step.toString());
    ++step;
    if(tryParse.int(commingMsg) != null){ // ?????? ??????
        if(step == 1){
            isLeagueInfo = true;
            SelectLeague(tryParse.int(commingMsg));
            Reply(eventObj, SelectLeagueInfoMessage());
        }  
        else if(step == 2 && isLeagueInfo){
            SelectLeagueInfo(eventObj, tryParse.int(commingMsg));
        }
        else if(step == 2 && !isLeagueInfo){
            SelectTeamInfo(eventObj, tryParse.int(commingMsg));
        }
    }
    else{ // ?????? ??????
        isLeagueInfo = false;
        papago.TranslateKRtoEN(commingMsg, function(transedMsg){
            currentTeamID = data.SearchTeam(transedMsg);
            Reply(eventObj, SelectTeamInfoMessage());
        });
    }
}

function SelectLeague(inputNum){
    let leagueID = 0;
    switch(inputNum){
        case 1: // ???????????? ??????????????????
            leagueID = 39;
            break;
        case 2: // ????????? ?????????
            leagueID = 140;
            break;
        case 3: // ???????????? ????????? A
            leagueID = 135;
            break;
        case 4: // ?????? ???????????????
            leagueID = 78;
            break;
        case 5: // ????????? ?????????
            leagueID = 61;
            break;
        case 6: // ???????????? ??????????????????
            leagueID = 94;
            break;
        case 7: // UEFA ??????????????????
            leagueID = 2;
            break;
        case 8: // UEFA ???????????????
            leagueID = 4;
            break;
        case 9: // UEFA ??????????????????
            leagueID = 848;
            break;
        case 10: // ???????????? K??????
            leagueID = 292;
            break;
        default:
            break;
    }
    currentLeagueID = leagueID;
    console.log("Returned League ID : %d", leagueID);
    return leagueID;
}

function SelectLeagueInfo(eventObj, inputNum){
    let returnMsg = "??? ??? ??????????????????. ?????? ???????????????."
    switch(inputNum){
        case 1: // ??? ??????
            soccerAPI.LeagueStanding(currentLeagueID, function(body){
                let standingJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < 20; i++){
                    valueText += standingJson.response[0].league.standings[0][i].rank + "|" + standingJson.response[0].league.standings[0][i].team.name + "|" + standingJson.response[0].league.standings[0][i].all.played + "|" + standingJson.response[0].league.standings[0][i].points + "|" + standingJson.response[0].league.standings[0][i].all.win + "|" + standingJson.response[0].league.standings[0][i].all.draw + "|" + standingJson.response[0].league.standings[0][i].all.lose + "|" + standingJson.response[0].league.standings[0][i].all.goals.for + "|" + standingJson.response[0].league.standings[0][i].all.goals.against + '\n';
                }
                returnMsg = MakeReplyMessage('??? ??????', '??????|??????|??????|??????|??????|?????????|??????|??????|??????', valueText);
                Reply(eventObj, returnMsg);
            });
            break;
        case 2: // ?????? ??????
            soccerAPI.TopScorer(currentLeagueID, function(body){
                let topScorerJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < 20; i++){
                    valueText += (i+1).toString() + "|" + topScorerJson.response[i].player.name + "|" + topScorerJson.response[i].statistics[0].team.name + "|" + topScorerJson.response[i].statistics[0].games.appearences  + "|" + topScorerJson.response[i].statistics[0].goals.total + '\n';
                }
                returnMsg = MakeReplyMessage('?????? ??????', '??????|??????|?????????|??????|??????', valueText);
                Reply(eventObj, returnMsg);
        });
            break;
        case 3: // ?????? ??????
            soccerAPI.TopAssist(currentLeagueID, function(body){
                let topAssistJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < 20; i++){
                    valueText += (i+1).toString() + "|" + topAssistJson.response[i].player.name + "|" + topAssistJson.response[i].statistics[0].team.name + "|" + topAssistJson.response[i].statistics[0].games.appearences + "|" + topAssistJson.response[i].statistics[0].goals.assists + '\n';
                }
                returnMsg = MakeReplyMessage('?????? ??????', '??????|??????|?????????|??????|??????', valueText);
                Reply(eventObj, returnMsg);
        });
            break;
        case 4: // ????????????
            SetDefault(eventObj.source.userId);
            break;
        default:
            break;
        Reply(eventObj, '????????????????????????.');
    }
    return returnMsg;
}

function SelectTeamInfo(eventObj, inputNum){
    let returnMsg = "??? ??? ??????????????????. ?????? ???????????????."

    if(currentTeamID == 0){
        Reply(eventObj, '?????? ?????????????????????.');
    }

    switch(inputNum){
        case 1: // ?????? ??????
            soccerAPI.GameSchehdule(currentTeamID, function(body){
                let gameScheduleJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < gameScheduleJson.response.length; i++){
                    valueText += (i+1).toString() + "|" + gameScheduleJson.response[i].fixture.date + "|" + gameScheduleJson.response[i].league.name + "|" + gameScheduleJson.response[i].teams.home.name + "|" + gameScheduleJson.response[i].teams.away.name + "|" + gameScheduleJson.response[i].fixture.status.long + "|" + gameScheduleJson.response[i].goals.home + "|" + gameScheduleJson.response[i].goals.away + '\n';
                }
                returnMsg = MakeReplyMessage('?????? ??????', '===========', valueText);
                Reply(eventObj, returnMsg);
            });
            break;
        case 2: // ??????
            soccerAPI.TeamMembers(currentTeamID, function(body){
                let teamMembersJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < teamMembersJson.response.length; i++){
                    valueText += (i+1).toString() + "|" + teamMembersJson.response[i].statistics[0].team.name + "|" + teamMembersJson.response[i].statistics[0].league.name + "|" + teamMembersJson.response[i].player.name + "|" + teamMembersJson.response[i].player.nationality + "|" + teamMembersJson.response[i].player.birth.date + "|" + teamMembersJson.response[i].statistics[0].games.appearences + "|" + teamMembersJson.response[i].statistics[0].games.minutes + "|" + teamMembersJson.response[i].statistics[0].games.position + "|" + teamMembersJson.response[i].statistics[0].games.captain + '\n';
                }
                returnMsg = MakeReplyMessage('??????', '============', valueText);
                Reply(eventObj, returnMsg);
            });
            break;
        case 3: // ????????????
            SetDefault(eventObj.source.userId);
            break;
        default:
            break;
    }
    return returnMsg;
}

function SetDefault(userID){
    step = 0;
    push.SendMessage(DefaultSelectMessage(), userID);
}

function MakeReplyMessage(title, keys, values){
    return title + '\n' + keys + '\n' + values;
}



function DefaultSelectMessage(){
    return '???????????? ?????? ????????? ??????????????????.\n????????????==================\n1. ???????????? ??????????????????\n2. ????????? ?????????\n3. ???????????? ????????? A\n4. ?????? ??????????????? 1\n5. ????????? ?????????\n6. ???????????? ??????????????????\n7. UEFA ??????????????????\n8. UEFA ???????????????\n9. UEFA ??????????????????\n10. ???????????? K-??????';
}

function SelectLeagueInfoMessage(){
    let msg = '1. ??? ?????? \n2. ?????? ?????? \n3. ?????? ?????? \n4. ????????????';
    return msg;
}

function SelectTeamInfoMessage(){
    let msg = '1. ?????? ?????? \n2. ?????? ?????? \n3. ????????????';
    return msg;
}