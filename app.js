
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , later = require('later');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// create the desired schedule
var sched = later.parse.cron('15 23 * * ? *');

// calculate the next 5 occurrences using local time
later.date.localTime();
var results = later.schedule(sched).next(1);

if(results.length > 0) {
    console.log("Results : \n" + results.join('\n'));
} else {
    var nextDate = new Date(results);
    var diff = new Date();
    console.log("Date is " +  (new Number(nextDate.getTime() - diff.getTime())/(1000 * 60 * 60)));
    console.log("Results : \n" + results);
}

app.get('/', routes.index);
app.get('/users', user.list);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
