var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var app = express();

var Nightmare = require('nightmare');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/crawler', function (req, res) {
  //기간 설정
  let key1counts = [];
  let key2counts = [];
  let dates = [];
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  while (startDate <= endDate) {
    let yesr = startDate.getFullYear();
    let month = startDate.getMonth() + 1;
    let date = startDate.getDate();

    if(month < 10) month = "0"+ month;
    if(date < 10) date = "0"+ date;

    let DATE =  yesr+ "." + month + "." + date;
    dates.push(DATE)
    startDate.setDate(startDate.getDate() + 1);
  }
  for (let date of dates) {
    getCount.call(null, MakeURL(req.query.key1, date), res, date, key1counts, key2counts, dates, "키워드1");
    getCount.call(null, MakeURL(req.query.key2, date), res, date, key2counts, key1counts, dates, "키워드2");
  }
})

app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function MakeURL(worls, date) {
  let url = "https://search.naver.com/search.naver?where=news&query=";
  for (let word of worls.split(" ")) {
    url = url + `%2B${word}`;
  }
  url = url + "&ie=utf8&sm=tab_opt&sort=0&photo=0&field=0&reporter_article=&pd=3&ds="
  url = url + date;
  url = url + "&de=";
  url = url + date;
  url = url + "&docid=&nso=so%3Ar%2Cp%3Afrom";
  url = url + date.split(".").join("");
  url = url + "to";
  url = url + date.split(".").join("");
  url = url + "%2Ca%3Aall&mynews=0&mson=0&refresh_start=0&related=0"
  return url;
}

function getCount(url, res, date, counts1, counts2, dates, keyword) {
  Nightmare({ show: true })
    .goto(url)
    .goto(url)
    .evaluate(function () {
      let info = document.querySelector('.title_desc.all_my');
      let count = info.innerText.split("/")[1].match(/\d+/g).join("");
      return count;
    })
    // .end()
    .then(function (count) {
      counts1.push({
        date : date,
        count : count,
        keyword : keyword
      });
      if (counts1.length == dates.length && counts2.length == dates.length) {
        res.send(JSON.stringify(counts1) + JSON.stringify(counts2));
      }
    })
    .catch(function (error) {
      counts1.push({
        date : date,
        count : 0,
        keyword : keyword
      });
      if (counts1.length == dates.length && counts2.length == dates.length) {
        res.send(JSON.stringify(counts1) + JSON.stringify(counts2));
      }
    });
}