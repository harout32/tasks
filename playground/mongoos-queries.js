 const {mongoose} = require('./../server/db/mongoose');
 const {Todo}     = require('./../server/models/todo');
 const {User}     = require('./../server/models/user');

 const {ObjectID} = require('mongodb');

 var id           = "69da1c3983751c6726a5ea62";
 
if(ObjectID.isValid(id)){

    Todo.find({_id:id})
    .then((todos)=>{
        console.log('saved',todos);
    })
    .catch((e)=>{
        console.log('not saved: ',e);
    });
   

    Todo.findOne({_id:id})
    .then((todo)=>{
        if(!todo){
            return console.log('todo not found');
        }
        console.log('find one: ' ,todo);
    })
    .catch((e)=>{console.log('not saved',e)});
   

    Todo.findById(id)
    .then((todo)=>{
        if(!todo){
            return console.log('no todo found with this ');
        }
        console.log('find by id : ',todo);
    })
    .catch((e)=>{console.log('not saved',e);
    });
}else{
    console.log('id is invalid');
}
