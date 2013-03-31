var request = require('request');


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/**
 * Wrapper for Wunderground Weather API
 **/
exports.weather = function(req, res) {
  var oath_key = 'b1db4d875d549c24';
  var base = 'http://api.wunderground.com/api/' + oath_key + '/conditions/q/';

  var state, city;
  state = req.params.state;
  city = req.params.city;
  
  var city = base + state + '/' + city + '.json';

  request(city, function(error, response, body) {
    if(error) {
      console.log("--ERROR-- WEATHER: " + error);
      res.status(500);
    } else {
      res.send(body);
    }
  });
};
