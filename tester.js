
var later = require('later');
var http = require('http');

var nextFireTimes = new Array();

// create the desired schedule
later.date.localTime();
var sched1 = later.parse.cron('24 * * * ? *');
var sched2 = later.parse.cron('25 * * * ? *');
var sched3 = later.parse.cron('26 * * * ? *');

var nextFireContext1 = {
    url : '/eat/cookie',
    sched : sched1,
    counter: 0
};

var nextFireContext2 = {
    url : '/eat/cake',
    sched : sched2,
    counter: 0
};

var nextFireContext3 = {
    url : '/eat/pie',
    sched : sched3,
    counter: 0
};

nextFireTimes.push(nextFireContext1);
nextFireTimes.push(nextFireContext2);
nextFireTimes.push(nextFireContext3);

function findContext(url) {
    for(var index = 0; index < nextFireTimes.length; index++) {
        var currContext = nextFireTimes[index];
        if(currContext.url === url) {
            return currContext;
        }
    }
}
function schedule() {
    nextFireTimes.map(function(curr){
         console.log('URL : ' + curr.url + ' fired ' + curr.counter);
    });

    var readyForFireSchedules = nextFireTimes.filter(isFiringTime);

    if((readyForFireSchedules !== null) && (readyForFireSchedules.length > 0)) {
        readyForFireSchedules.map(function(firedNow) {
            console.log('Firing URL: ' + firedNow.url);
            var context = findContext(firedNow.url);
            context.counter++;
            fireNow(firedNow);
        })
    }
    setTimeout(schedule, 1000);
}

function isFiringTime(firingContext) {
    var nextFireTime = later.schedule(firingContext.sched).next(1);
    var nextFireDate = new Date(nextFireTime);
    var secsLeft = Math.floor((nextFireDate.getTime() - new Date().getTime())/1000)
    console.log("Seconds left " + secsLeft);
    return secsLeft === 0;
}

function fireNow(firingContext) {
    console.log('Started firing HTTP request to ' + firingContext.url);
    var options = {
        host: 'google.com',
        port: 80,
        path: firingContext.url
    };

    http.get(options, function(resp){
        resp.on('data', function(chunk){
            console.log('Found ' + chunk);
        });
    }).on("error", function(e){
            console.log("Got error: " + e.message);
        });
}

schedule();

