
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var users = require('./routes/users');  
var signup = require('./routes/signup');
var login = require('./routes/login');

var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql');


// all environments
app.set('port', process.env.PORT || 4303);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'multitenantproject'

    },'pool') //or single

);

app.get('/', login.login);
app.get('/login', login.login);
app.get('/signup', signup.signup);
app.post('/users/signup',users.signup);
app.post('/users/login',users.loginAuthentication);
app.post('/users/edit/:email',users.edit);
app.post('/users/edit_save/:userid',users.edit_save);
app.post('/users/delete/:email',users.delete_user);

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
