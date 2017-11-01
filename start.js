require('./server/config/config');
let {mongoose}   = require('./server/db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const users = require('./server/routes/users');
const todos = require('./server/routes/todos')
const port = process.env.PORT;

let app    = express();
// just for dev
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,x-auth,  X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
    next();
});

app.use(express.static(path.join(__dirname,'dist')));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/users',users);
app.use('/todos',todos);

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/index.html'));
})



app.listen(port, ()=>{
    console.log(`started at port ${port}`);
});