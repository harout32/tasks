var _       = require('lodash');
// var {mongoose}   = require('../server/db/mongoose');
var {User}    = require('../server/models/user.js');

var userTest  = {email: 'hahah@example.com',password: '123123123'};
var body      = _.pick(userTest,['email','password']);
var user      = new User({password:body.password});


console.log(user);



// var hell   = _.pick({name:'harout',age:23},["name","age"]);
// console.log(hell);