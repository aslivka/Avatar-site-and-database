
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require("body-parser");

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', 10000);
app.set('mysql', mysql);
app.use('/', express.static('resources'));
app.use('/vendors', express.static('vendors'));
app.use('/characters', require('./resources/js/character.js'));
app.use('/nations', require('./resources/js/nations.js'));
app.use('/cities', require('./resources/js/cities.js'));
app.use('/orgs', require('./resources/js/organizations.js'));
app.use('/bending', require('./resources/js/bending.js'));
app.use('/benders', require('./resources/js/benders.js'));
app.use('/filterchar', require('./resources/js/filterchar.js'));

// app.use('/people_certs', require('./people_certs.js'));

app.get('/',function(req,res,next){
  var context = {};
  res.render('index');
 });


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});



