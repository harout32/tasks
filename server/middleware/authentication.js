let {User} = require('./../models/user');


let authentication = (req, res, next)=>{
    let token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
        return Promise.reject();
        }
        req.token = token;
        req.user  = user;
        next();
    }).catch((e)=>{
        res.status(401).send();
    })
};

module.exports = {authentication};