const soccerAPI = '526fc70a2e8b315e9a960ac4b4764191';
const hostUrl = 'v3.football.api-sports.io';

var request = require('request');
var papago = require('./transmessage.js');

var sampleLeagueNum = '39';
var sampleSeasonNum = '2021';

const sampleTeamBody = {"get":"teams","parameters":{"league":"39","season":"2021"},"errors":[],"results":20,"paging":{"current":1,"total":1},"response":[{"team":{"id":33,"name":"Manchester United","code":"MUN","country":"England","founded":1878,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/33.png"},"venue":{"id":556,"name":"Old Trafford","address":"Sir Matt Busby Way","city":"Manchester","capacity":76212,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/556.png"}},{"team":{"id":34,"name":"Newcastle","code":"NEW","country":"England","founded":1892,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/34.png"},"venue":{"id":562,"name":"St. James' Park","address":"St. James&apos; Street","city":"Newcastle upon Tyne","capacity":52389,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/562.png"}},{"team":{"id":38,"name":"Watford","code":"WAT","country":"England","founded":1881,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/38.png"},"venue":{"id":596,"name":"Vicarage Road","address":"Vicarage Road","city":"Watford","capacity":22200,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/596.png"}},{"team":{"id":39,"name":"Wolves","code":"WOL","country":"England","founded":1877,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/39.png"},"venue":{"id":600,"name":"Molineux Stadium","address":"Waterloo Road","city":"Wolverhampton, West Midlands","capacity":32050,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/600.png"}},{"team":{"id":40,"name":"Liverpool","code":"LIV","country":"England","founded":1892,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/40.png"},"venue":{"id":550,"name":"Anfield","address":"Anfield Road","city":"Liverpool","capacity":55212,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/550.png"}},{"team":{"id":41,"name":"Southampton","code":"SOU","country":"England","founded":1885,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/41.png"},"venue":{"id":585,"name":"St. Mary's Stadium","address":"Britannia Road","city":"Southampton, Hampshire","capacity":32689,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/585.png"}},{"team":{"id":42,"name":"Arsenal","code":"ARS","country":"England","founded":1886,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/42.png"},"venue":{"id":494,"name":"Emirates Stadium","address":"Queensland Road","city":"London","capacity":60383,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/494.png"}},{"team":{"id":44,"name":"Burnley","code":"BUR","country":"England","founded":1882,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/44.png"},"venue":{"id":512,"name":"Turf Moor","address":"Harry Potts Way","city":"Burnley","capacity":22546,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/512.png"}},{"team":{"id":45,"name":"Everton","code":"EVE","country":"England","founded":1878,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/45.png"},"venue":{"id":8560,"name":"Goodison Park","address":"Goodison Road","city":"Liverpool","capacity":40569,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/8560.png"}},{"team":{"id":46,"name":"Leicester","code":"LEI","country":"England","founded":1884,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/46.png"},"venue":{"id":547,"name":"King Power Stadium","address":"Filbert Way","city":"Leicester, Leicestershire","capacity":34310,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/547.png"}},{"team":{"id":47,"name":"Tottenham","code":"TOT","country":"England","founded":1882,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/47.png"},"venue":{"id":593,"name":"Tottenham Hotspur Stadium","address":"Bill Nicholson Way, 748 High Road","city":"London","capacity":62062,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/593.png"}},{"team":{"id":48,"name":"West Ham","code":"WES","country":"England","founded":1895,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/48.png"},"venue":{"id":598,"name":"London Stadium","address":"Marshgate Lane, Stratford","city":"London","capacity":60000,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/598.png"}},{"team":{"id":49,"name":"Chelsea","code":"CHE","country":"England","founded":1905,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/49.png"},"venue":{"id":519,"name":"Stamford Bridge","address":"Fulham Road","city":"London","capacity":41841,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/519.png"}},{"team":{"id":50,"name":"Manchester City","code":"MAC","country":"England","founded":1880,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/50.png"},"venue":{"id":555,"name":"Etihad Stadium","address":"Rowsley Street","city":"Manchester","capacity":55097,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/555.png"}},{"team":{"id":51,"name":"Brighton","code":"BRI","country":"England","founded":1901,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/51.png"},"venue":{"id":508,"name":"The American Express Community Stadium","address":"Village Way","city":"Falmer, East Sussex","capacity":31800,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/508.png"}},{"team":{"id":52,"name":"Crystal Palace","code":"CRY","country":"England","founded":1905,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/52.png"},"venue":{"id":525,"name":"Selhurst Park","address":"Holmesdale Road","city":"London","capacity":26309,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/525.png"}},{"team":{"id":55,"name":"Brentford","code":"BRE","country":"England","founded":1889,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/55.png"},"venue":{"id":10503,"name":"Brentford Community Stadium","address":"166 Lionel Rd N, Brentford","city":"Brentford, Middlesex","capacity":17250,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/10503.png"}},{"team":{"id":63,"name":"Leeds","code":"LEE","country":"England","founded":1919,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/63.png"},"venue":{"id":546,"name":"Elland Road","address":"Elland Road","city":"Leeds, West Yorkshire","capacity":40204,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/546.png"}},{"team":{"id":66,"name":"Aston Villa","code":"AST","country":"England","founded":1874,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/66.png"},"venue":{"id":495,"name":"Villa Park","address":"Trinity Road","city":"Birmingham","capacity":42788,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/495.png"}},{"team":{"id":71,"name":"Norwich","code":"NOR","country":"England","founded":1902,"national":false,"logo":"https:\/\/media.api-sports.io\/football\/teams\/71.png"},"venue":{"id":565,"name":"Carrow Road","address":"Carrow Road","city":"Norwich, Norfolk","capacity":27606,"surface":"grass","image":"https:\/\/media.api-sports.io\/football\/venues\/565.png"}}]};

var defaultLeagueIDs = [39, 140, 135, 78, 61, 94, 2, 4, 848, 292];

var IDNameDict = {};
var responseTeamArr = [];
var responsePlayerArr = [];

//League ID를 알 때 Team ID들 불러오는 API
function GetTeamIDsByLeagueID(leagueNum, seasonNum){
    var options = {
        method : 'GET',
        url : 'https://v3.football.api-sports.io/teams?league='+leagueNum+'&season='+seasonNum,
        
        headers:{
            'x-rapidapi-host':hostUrl,
            'x-rapidapi-key':soccerAPI
        }
    };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        console.log(body);
        responseTeamArr = body.response;
        WriteTeamData();
    });
}

// League ID를 알 때 Player ID들 불러오는 API
// function GetPlayerIDsByLeagueID(leagueNum, seasonNum){
//     var options = {
//         method : 'GET',
//         url : 'https://v3.football.api-sports.io/players?league='+leagueNum+'&season='+seasonNum,
        
//         headers:{
//             'x-rapidapi-host':hostUrl,
//             'x-rapidapi-key':soccerAPI
//         }
//     };
//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//         console.log(body);
//     });
// }


function WriteTeamData(){
    var fs = require('fs');
    responseTeamArr.forEach(teamInfo => {
        try{
            fs.appendFileSync('teamData.txt', JSON.stringify(teamInfo.team.name).replace(/\"/gi, "")+'\n', 'utf-8');
            console.log('01 Key DONE!');
        }catch(e){
            console.log(e);
        }
        try{
            fs.appendFileSync('teamData.txt', JSON.stringify(teamInfo.team.id).replace(/\"/gi, "")+'\n', 'utf-8');
            console.log('02 Value DONE!');
        }catch(e){
            console.log(e);
        }
    })
    SetTeamDataDictionary();
}

function SetTeamDataDictionary(){
    var fs = require('fs');
    var array = fs.readFileSync('teamData.txt').toString().split("\n");
    // 맨 끝 빈 칸 제거
    if(array[array.length-1] == ''){
        array.length = array.length - 1; 
    }
    for(var i = 0; i < array.length; i++){
        if(i % 2 == 0){
            IDNameDict[array[i]] = array[i+1];
        }
    }
}

function GetTeamIDByName(teamName){
    if(teamName in IDNameDict){
        console.log(teamName + " : " + IDNameDict[teamName]);
        return IDNameDict[teamName];
    }
    else{
        console.log("There is no team name in this league");
        return 0;
    }
}

function WriteAllData(){
    defaultLeagueIDs.forEach(leagueID => {
        GetTeamIDsByLeagueID(leagueID, 2021);
    });
}

function FindDataFile(){
    var fs = require('fs');

    fs.exists('teamData.txt', function(is){
        if(is){
            console.log("File Yes");
            SetTeamDataDictionary();
        }
        else{
            console.log("File No");
            WriteAllData();
        }
    })
}

exports.SetData = function(){
    FindDataFile();
}

exports.SearchLeague = function(){
    return 0;
}

exports.SearchTeam = function(teamName){
    return GetTeamIDByName(teamName);
}