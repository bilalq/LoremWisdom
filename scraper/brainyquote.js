var jsdom = require('jsdom');
var request = require('request');
var async = require('async');

var config = require('../config');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

connection.connect();

var tags = ['technology', 'computers', 'cool', 'dating', 'diet', 'experience', 'failure', 'food', 'happiness', 'men', 'women', 'science', 'sad', 'patience'];

for(var tag_i = 1; tag_i < tags.length -1; tag_i++) {
  var tag = tags[tag_i];

  request({uri: 'http://brainyquote.com/quotes/topics/topic_' + tag + '.html?SPvm=1&vm=l'}, function(err, response, body){
    if(err && response.statusCode !== 200){
      console.log('Request error.');
    }

    jsdom.env({
      html: body,
      scripts: ['http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js']
    }, function(err, window){
      var $ = window.jQuery;
      var last_page = $('.pagination ul li:nth-last-child(2) a').first().text();

      for(var i = 1; i <= last_page; i++) {
        var page = i;

        request({uri: 'http://brainyquote.com/quotes/topics/topic_' + tag + page  + '.html?SPvm=1&vm=l'}, function(err, response, body){
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

              var query = connection.query('INSERT into quotes (quote, author, tag) VALUES (?, ?, ?)', [quote, author, tag], function(err, result) {

                if(err) {
                  console.log('--MYSQL ERROR--' + err);
                }
              });

              console.log("Quote: " + quote + " --Author:" + author);
            });
          });
        });
      }
    });
  });
}
