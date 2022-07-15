var data = require('./getid.js');

// 입력: 팀ID, 리그ID, 시즌 입력,  반환: 경기일정 
function GetGameSchedule(teamID, leagueID, season, callbackFunc){
    var request = require("request");
    var options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/fixtures',
    qs: {team: teamID, league: leagueID, season: season},
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
    }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        callbackFunc(body);
    });
}



// 입력: 리그ID, 시즌(*필수)   반환: 팀 순위 
function GetLeagueStanding(leagueID, season, callbackFunc){
    var request = require("request");
    var options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/standings',
    qs: {league : leagueID, season: season},
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
    }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        callbackFunc(body);
    });
}

exports.LeagueStanding = function(leagueID, callbackFunc){
    GetLeagueStanding(leagueID, 2021, callbackFunc);
}

// 입력: 리그ID(*필수), 시즌(*필수),  반환: (선수) 득점 순위
function GetTopScorer(leagueID, season, callbackFunc){
    var request = require("request");
    var options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/players/topscorers',
    qs: {league : leagueID, season: season},
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
    }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        callbackFunc(body);
    });
}

exports.TopScorer = function(leagueID, callbackFunc){
    GetTopScorer(leagueID, 2021, callbackFunc);
}

// 입력: 리그ID(*필수), 시즌(*필수), 반환: 도움 순위
function GetTopAssist(leagueID, season, callbackFunc){
    var request = require("request");
    var options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/players/topassists',
    qs: {league : leagueID, season: season},
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
    }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        callbackFunc(body)
    });
}

exports.TopAssist = function(leagueID, callbackFunc){
    GetTopAssist(leagueID, 2021, callbackFunc);
}

// 입력: 팀ID, 시즌(*필수), 반환: 경기 일정
function GetGameSchedule_teamname(season, teamID, callbackFunc){
    var request = require("request");
    var options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/fixtures',
    qs: {season: season, team: teamID},
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
    }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        callbackFunc(body);
    });
}

exports.GameSchehdule = function(teamID, callbackFunc){
    GetGameSchedule_teamname(2021, teamID, callbackFunc);
}

// 입력: 팀ID,시즌(*필수),  반환: 소속 선수
function GetTeamMembers(season, teamID, callbackFunc){
    var request = require("request");
    var options = {
      method: 'GET',
      url: 'https://v3.football.api-sports.io/players',
      qs: {season: season, team: teamID},
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
      }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        callbackFunc(body);
    })    
}

exports.TeamMembers = function(teamID, callbackFunc){
    GetTeamMembers(2021, teamID, callbackFunc);
}

// 입력: 팀ID, 시즌*(필수),   반환: 팀 순위 
function GetTeamStanding(season, teamID){
    var request = require("request");
    var options = {
    method: 'GET',
    url: 'https://v3.football.api-sports.io/standings',
    qs: {season: season, team: teamID},
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
    }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}



