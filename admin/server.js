var express = require('express');
var path=require('path');
var bodyparser=require('body-parser');
var cors=require('cors');
var passport=require('passport');
var mongoose=require('mongoose');
var config=require('./config/database');
var users=require('./routes/users');
//connect the database
mongoose.connect(config.database);
//on the database
mongoose.connection.on('connected',()=>{
  console.log('connected to database'+config.database);

});
mongoose.connection.on('error',(err)=>
{
  console.log('database error:',+err);
});
var app = express();


var port = 3000;
app.use(cors());
//SET STATIC FOLDER
// app.use(express.static(path.json(_dirname,'public')));

app.use(bodyparser.json());
//middle ware passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users',users);

app.get('/', (req, res) => {
  res.send('Hello this is wonderful!!');
});

app.listen(port, () => {
  console.log("some magic occured in port" + port )
});
