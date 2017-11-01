const _       = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
let {Todo}       = require('../models/todo');
let {User}       = require('../models/user');
let {authentication} = require('../middleware/authentication');

const router = express.Router();

//adding new todo**
router.post('',authentication, (req,res)=>{
    let body = _.pick(req.body,['title','description','state']);
    body._creator = req.user._id;
    let todo = new Todo(body);
    todo.save().then((doc)=>{
        res.send(doc)
    },(e)=>{
        res.status(400).send(e);
    })
});
//getting all todos
router.get('',authentication, (req, res)=>{
     Todo.find({_creator: req.user._id}).then((todos)=>{
         res.send({todos});
     },(err)=>{
         res.status(400).send(err);
     });
})

//get specific todo by id
router.get('/:id',authentication, (req, res)=>{
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send(todo);
 
    }).catch((e)=>{
        res.status(400).send();
    });
});
//delete todo by id
router.delete('/:id',authentication, (req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id:id,
        _creator: req.user.id
    })
    .then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send(todo)})
    .catch((err)=>{
            res.status(400).send();
        });
});
//updating todo by id**
router.patch('/:id',authentication, (req,res)=>{
    let id   = req.params.id;
    let body = _.pick(req.body,['title','description','state']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(body.state === "completed"){
        body.completedAt = new Date().getTime();
    }else{
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id:id,
        _creator: req.user._id
    },{$set:body},{new:true})
    .then((todo)=>{
        if(!todo){
            return res.status(404).send(); 
        }
        res.send({todo})})
    .catch((e)=>{
        res.status(400).send();
    })
});
module.exports = router