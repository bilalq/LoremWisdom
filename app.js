
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var constrain_limit = function(req, res, next) {
  var limit = parseInt(req.param('limit'), 10) || 1;
  if(limit < 0) {
    limit = 0;
  } else if(limit > 50) {
    limit = 50;
  }
  req.query.limit = limit;
  next();
};

app.get('/', routes.index);

app.get('/docs', routes.docs);
app.get('/facts', routes.facts);
app.get('/proverbs', routes.proverbs);
app.get('/quotes', routes.quotes);
app.get('/paragraph', routes.paragraph);
//app.get('/suprise', routes.suprise);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
