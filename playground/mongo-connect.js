const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID;
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log('Unable to connect to the DATABASE');
        return;
    }
    console.log('connected to the server',obj.getTimestamp());

    db.close();
});