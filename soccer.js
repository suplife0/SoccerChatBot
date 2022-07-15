// var request = require('request');
//     var options = {
//         method: 'GET',
//         url: 'https://v3.football.api-sports.io/players',  
//         qs: {id: 276, season: 2019},
//         headers: {
//             'x-rapidapi-host': 'v3.football.api-sports.io',
//             'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
//         }
//     };
//     request(options, function (error, response) {
//       if (error) throw new Error(error);
//     });
var request = require("request");

var options = {
  method: 'GET',
  url: 'https://v3.football.api-sports.io/standings',
  qs: {league: '39', season: '2021'},
  headers: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-rapidapi-key': '526fc70a2e8b315e9a960ac4b4764191'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
  body = JSON.parse(body);
  console.log(body);
});


  