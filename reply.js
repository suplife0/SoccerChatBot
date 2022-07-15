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
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
  }

function Reply(eventObj,replyMsg){

    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}` // 인증정보 : channel token 값을 통해 인증.
            },
            json: {
                "replyToken":eventObj.replyToken, // reply token : 누구한테 보낼 것인지?를 판별하기 위해!
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
    if(tryParse.int(commingMsg) != null){ // 리그 선택
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
    else{ // 팀명 입력
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
        case 1: // 잉글랜드 프리미어리그
            leagueID = 39;
            break;
        case 2: // 스페인 라리가
            leagueID = 140;
            break;
        case 3: // 이탈리아 세리에 A
            leagueID = 135;
            break;
        case 4: // 독일 분데스리가
            leagueID = 78;
            break;
        case 5: // 프랑스 리그앙
            leagueID = 61;
            break;
        case 6: // 포르투칼 프리메라리가
            leagueID = 94;
            break;
        case 7: // UEFA 챔피언스리그
            leagueID = 2;
            break;
        case 8: // UEFA 유로파리그
            leagueID = 4;
            break;
        case 9: // UEFA 컨퍼런스리그
            leagueID = 848;
            break;
        case 10: // 대한민국 K리그
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
    let returnMsg = "잘 못 고르셨습니다. 다시 골라주세요."
    switch(inputNum){
        case 1: // 팀 순위
            soccerAPI.LeagueStanding(currentLeagueID, function(body){
                let standingJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < 20; i++){
                    valueText += standingJson.response[0].league.standings[0][i].rank + "|" + standingJson.response[0].league.standings[0][i].team.name + "|" + standingJson.response[0].league.standings[0][i].all.played + "|" + standingJson.response[0].league.standings[0][i].points + "|" + standingJson.response[0].league.standings[0][i].all.win + "|" + standingJson.response[0].league.standings[0][i].all.draw + "|" + standingJson.response[0].league.standings[0][i].all.lose + "|" + standingJson.response[0].league.standings[0][i].all.goals.for + "|" + standingJson.response[0].league.standings[0][i].all.goals.against + '\n';
                }
                returnMsg = MakeReplyMessage('팀 순위', '순위|팀명|경기|득점|승리|무승부|패배|득점|실점', valueText);
                Reply(eventObj, returnMsg);
            });
            break;
        case 2: // 득점 순위
            soccerAPI.TopScorer(currentLeagueID, function(body){
                let topScorerJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < 20; i++){
                    valueText += (i+1).toString() + "|" + topScorerJson.response[i].player.name + "|" + topScorerJson.response[i].statistics[0].team.name + "|" + topScorerJson.response[i].statistics[0].games.appearences  + "|" + topScorerJson.response[i].statistics[0].goals.total + '\n';
                }
                returnMsg = MakeReplyMessage('득점 순위', '순위|이름|소속팀|경기|득점', valueText);
                Reply(eventObj, returnMsg);
        });
            break;
        case 3: // 도움 순위
            soccerAPI.TopAssist(currentLeagueID, function(body){
                let topAssistJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < 20; i++){
                    valueText += (i+1).toString() + "|" + topAssistJson.response[i].player.name + "|" + topAssistJson.response[i].statistics[0].team.name + "|" + topAssistJson.response[i].statistics[0].games.appearences + "|" + topAssistJson.response[i].statistics[0].goals.assists + '\n';
                }
                returnMsg = MakeReplyMessage('도움 순위', '순위|이름|소속팀|경기|도움', valueText);
                Reply(eventObj, returnMsg);
        });
            break;
        case 4: // 처음으로
            SetDefault(eventObj.source.userId);
            break;
        default:
            break;
        Reply(eventObj, '잘못고르셨습니다.');
    }
    return returnMsg;
}

function SelectTeamInfo(eventObj, inputNum){
    let returnMsg = "잘 못 고르셨습니다. 다시 골라주세요."

    if(currentTeamID == 0){
        Reply(eventObj, '잘못 입력하셨습니다.');
    }

    switch(inputNum){
        case 1: // 경기 일정
            soccerAPI.GameSchehdule(currentTeamID, function(body){
                let gameScheduleJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < gameScheduleJson.response.length; i++){
                    valueText += (i+1).toString() + "|" + gameScheduleJson.response[i].fixture.date + "|" + gameScheduleJson.response[i].league.name + "|" + gameScheduleJson.response[i].teams.home.name + "|" + gameScheduleJson.response[i].teams.away.name + "|" + gameScheduleJson.response[i].fixture.status.long + "|" + gameScheduleJson.response[i].goals.home + "|" + gameScheduleJson.response[i].goals.away + '\n';
                }
                returnMsg = MakeReplyMessage('경기 일정', '===========', valueText);
                Reply(eventObj, returnMsg);
            });
            break;
        case 2: // 명단
            soccerAPI.TeamMembers(currentTeamID, function(body){
                let teamMembersJson = JSON.parse(body);
                let valueText = "";
                for(var i = 0; i < teamMembersJson.response.length; i++){
                    valueText += (i+1).toString() + "|" + teamMembersJson.response[i].statistics[0].team.name + "|" + teamMembersJson.response[i].statistics[0].league.name + "|" + teamMembersJson.response[i].player.name + "|" + teamMembersJson.response[i].player.nationality + "|" + teamMembersJson.response[i].player.birth.date + "|" + teamMembersJson.response[i].statistics[0].games.appearences + "|" + teamMembersJson.response[i].statistics[0].games.minutes + "|" + teamMembersJson.response[i].statistics[0].games.position + "|" + teamMembersJson.response[i].statistics[0].games.captain + '\n';
                }
                returnMsg = MakeReplyMessage('명단', '============', valueText);
                Reply(eventObj, returnMsg);
            });
            break;
        case 3: // 처음으로
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
    return '리그번호 혹은 팀명을 입력해주세요.\n리그번호==================\n1. 잉글랜드 프리미어리그\n2. 스페인 라리가\n3. 이탈리아 세리에 A\n4. 독일 분데스리가 1\n5. 프랑스 리그앙\n6. 포르투갈 프리메라리가\n7. UEFA 챔피언스리그\n8. UEFA 유로파리그\n9. UEFA 컨퍼런스리그\n10. 대한민국 K-리그';
}

function SelectLeagueInfoMessage(){
    let msg = '1. 팀 순위 \n2. 득점 순위 \n3. 도움 순위 \n4. 처음으로';
    return msg;
}

function SelectTeamInfoMessage(){
    let msg = '1. 경기 일정 \n2. 선수 명단 \n3. 처음으로';
    return msg;
}