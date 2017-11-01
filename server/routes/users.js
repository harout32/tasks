const _       = require('lodash');
const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
let {authentication} = require('../middleware/authentication');
let {Todo}       = require('../models/todo');
let {User}       = require('../models/user');


// sign up new user
router.post('',(req,res)=>{
    let body = _.pick(req.body,['email','password','name'])
    let user = new User(body);
    user.save()
    .then(()=>{
        user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send({user,token});
        });
    }).catch((err)=>{
        res.status(400).send(err);
    });
});
//useres LOGIN

router.post('/login',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send({user,token});
        });
        
    }).catch((err)=>{
        res.status(401).send({message:'email or password was wrong'});
    });
});

//user logout
router.delete('/logout',authentication,(req, res)=>{
     req.user.removeToken(req.token)
     .then(()=>{
         res.status(200).send();
     })
     .catch((err)=>{
         res.status(400).send();
     });
})
//geting user info by token
router.get('/me',authentication,(req,res)=>{
    res.send(req.user);
});

//listening to the port 
module.exports = router