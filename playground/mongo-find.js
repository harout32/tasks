const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log('Unable to connect to the DATABASE');
        return;
    }
    db.collection('Todos').find().toArray()
    .then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log('unable to fetch todos',err);
    });
    

    db.close();
});