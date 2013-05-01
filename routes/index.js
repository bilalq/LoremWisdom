var config = require('../config');

var async = require('async');

var request = require('request');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});


connection.connect();

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.index = function(req, res){
  res.render('index', { title: 'Lorem Wisdom' });
};

exports.docs = function(req, res){
  var end_points = [
    {
      verb: 'GET',
      route: '/quotes',
      description: 'This endpoint returns a random quote',
      example_response: {
        text: '[\n  {\n   "id": 3423,\n   "quote": "Even when I begin with a situation that\'s basically funny or sad, I like to keep poking around in it. I like to get into the middle of a relationship, to explore the subtle places.",\n   "author": "Paul Mazursky",\n    "tag": "sad"\n  },\n  {\n   "id": 5070,\n   "quote": "If you don\'t physically age gracefully, it\'s a bit sad. I think Steven Tyler can get away anything, because he still looks like he did in \'73. Especially from row Z backwards in an arena. As long as the Stones keep their hair and don\'t get fat they\'ll get away with the wrinkles.",\n    "author": "Joe Elliott",\n    "tag": "sad"\n  }\n]'
      },
      optional_parameters: [
        {name: 'limit', desc: 'Number of items to return'},
        {name: 'tag', desc: 'Category of quotes. Available categories are: "technology", "wisdom", "patience", and "sad"'},
        {name: 'id', desc: 'Return a quote with this id. Permalink'}
      ]
    },
    {
      verb: 'GET',
      route: '/facts',
      description: 'This endpoint returns a random fact',
      example_response: {
        text: '[\n  {\n   "id": 522,\n    "text": "The average cat can jump 5 times as high as its tail is long.",\n    "tag": "snapple"\n  },\n  {\n   "id": 677,\n    "text": "Vanilla is used to make chocolate.",\n   "tag": "snapple"\n  }\n]'
      },
      optional_parameters: [
        {name: 'limit', desc: 'Number of items to return'},
        {name: 'tag', desc: 'Category of quotes. Available categories are: "snapple"'},
        {name: 'id', desc: 'Return a fact with this id. Permalink'}
      ]
    },
    {
      verb: 'GET',
      route: '/paragraph',
      description: 'This endpoint creates a paragraph with random facts',
      example_response: { text:
        '{ \n "paragraph": "In The average lifetime, a person will walk The equivalent of 5 times around The equator. The original name of Nashville, Tennessee, was Big Salt Lick. Apples, peaches and raspberries are all members or the rose family. The pound sign, or #, is called an \'octothorp\'. Cold water weighs less than hot water. \n\n Mongolians invented lemonade around 1299 A.D. To take lumps out of a bag of sugar, place it in the refrigerator for 24 hours. Bamboo (the world\'s tallest grass) can grow up to 90cm in a day. The first sport to be filmed was boxing in 1894. You transfer more germs shaking hands than kissing. \n\n Broccoli is the only vegetable that is also a flower. When the moon is directly over you, you weigh less. The human brain takes up 2% of human body weight but uses 20% of its energy. In the U.S. a pig has to weigh more than 180 lbs to be called a hog The only bird who can see the color blue is the owl. \n\n A twit is the technical term for a pregnant goldfish. Americans on average eat 18 acres of pizza a day. Animals that lay eggs don\'t have belly buttons. In the U.S., there are about 15,000 vacuum cleaner-related accidents. Snoopy is the most common dog name beginning with the letter S. \n\n Theodore Roosevelt was the only president blind in one eye. The National Park Service manages over 350 parks on 80 million acres of public land. Pilates stretches your muscles, improving your posture and helping you appear taller. Men get hiccups more than women. Licking a stamp burns 10 calories.",\n  "number_paragraphs": 5\n}'
      },
      optional_parameters: [
        {name: 'paragraphs', desc: 'Number of paragraphs to return'}
      ]
    },
    {
      verb: 'GET',
      route: '/title',
      description: 'This endpoint returns a random title',
      example_response: {
        text: '{\n  "text": "Connectionless Fire-Bell"\n}'
      },
      optional_parameters: [
      ]
    },
  ];
  res.render('docs', { title: 'Lorem Wisdom | API Docs', docs: end_points });
};

function makeQuery(table, req) {
  var sql_input = [];

  //Base query
  var sql_statement = 'SELECT * FROM ' + table;

  //tag
  if(req.param('tag')) {
    sql_statement += ' WHERE tag = ?';
    sql_input.push(req.param('tag'));
  }

  //id
  if(req.param('id')) {
    if(req.param('tag')) {
      sql_statement += ' and id = ?';
    } else {
      sql_statement += ' WHERE id = ?';
    }
    sql_input.push(req.param('id'));
  }

  //random
  sql_statement += ' ORDER BY RAND()';

  //limit
  var limit = parseInt(req.param('limit'), 10) || 1;
  if(limit < 0) {
    limit = 0;
  } else if(limit > 50) {
    limit = 50;
  }
  sql_statement += ' LIMIT ?';
  sql_input.push(limit);

  return {statement: sql_statement, input: sql_input};
}

exports.facts = function(req, res) {
  var sql_obj = makeQuery('facts', req);

  connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.proverbs = function(req, res) {
  var sql_obj = makeQuery('proverbs', req);

  connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.quotes = function(req, res) {
  var sql_obj = makeQuery('quotes', req);

  connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.paragraph = function(req, res) {
  var num_para = req.param('paragraphs') || 5;

  var facts = [];

  var i = 0;
  async.whilst(function() { return i < num_para; },
    function(callback) {
      i++;
      var tmp_req = req;
      tmp_req.params.limit = 5;
      tmp_req.params.tag = req.param('tag');
      var sql_obj = makeQuery('facts', tmp_req);
      connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          facts = facts.concat(results);
          facts.push({text: '\n\n'});
        }
        callback(err, results);
      })
    },
    function(err, stuff) {
      var paragraphs = "";

      for(var i = 0; i < facts.length; i++) {
        var text = facts[i].text;
        paragraphs += text + ' ';
      }
      res.send(200, {paragraph: paragraphs, number_paragraphs: num_para});
    }
  );
};

exports.surprise = function(req, res) {

};

exports.title = function(req, res) {
  request('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=-1&sortBy=count&sortOrder=desc&limit=1&api_key=e823d346d3ee00988112a588266071dcb398b2460e6b7cd33', function(err, response, body) {

    if(!err && response.statusCode === 200) {
      var obj = {};
      body = JSON.parse(body);
      obj.adjective = body[0].word;

      console.log(body);

      request('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=-1&sortBy=count&sortOrder=desc&limit=1&api_key=e823d346d3ee00988112a588266071dcb398b2460e6b7cd33', function(err, response, body) {
        if(!err && response.statusCode === 200) {
          body = JSON.parse(body);
          obj.noun = body[0].word;

          console.log(body);

          var title = toTitleCase(obj.adjective + ' ' + obj.noun);

          res.send(200, {text: title});
        } else {
          res.send(500, err);
        }
      });
    } else {
      res.send(500, err);
    }
  });

};
