var jsdom = require('jsdom');
var request = require('request');

var config = require('../config');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

connection.connect();

for(var i = 1; i <= 29; i++) {
  var page = i;

  request({uri: 'http://brainyquote.com/quotes/topics/topic_wisdom' + page  + '.html?SPvm=1&vm=l'}, function(err, response, body){
    var self = this;

    self.items = [];
    if(err && response.statusCode !== 200){
      console.log('Request error.');
    }

    jsdom.env({
      html: body,
      scripts: ['http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js']
    }, function(err, window){
      var $ = window.jQuery;

      $('.boxy').each(function(key, value) { 
        var quote = $(".bqQuoteLink a", value).text();
        var author = $(".bodybold a", value).text();

        var query = connection.query('INSERT into quotes (quote, author) VALUES (?, ?)', [quote, author], function(err, result) {
          
          if(err) {
            console.log('--MYSQL ERROR--' + err);
          }
        });

        console.log(query.sql);

        console.log("Quote: " + quote + " --Author:" + author);
      });
    });
  });
}
