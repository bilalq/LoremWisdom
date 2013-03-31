
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

app.get('/', constrain_limit, routes.index);
app.get('/facts', constrain_limit, routes.facts);
app.get('/proverbs', constrain_limit, routes.proverbs);
app.get('/quotes', constrain_limit, routes.quotes);
app.get('/suprise', constrain_limit, routes.suprise);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
