let mongoose     = require('mongoose');
const validator  = require('validator');
const jwt        = require('jsonwebtoken');
const _          = require('lodash');
const bcrypt     = require('bcryptjs');


let UserSchema   = new mongoose.Schema({
        name:              {
            required:      true,
            trim:          true,
            type:          String,
            minlength:     1,
        },
        email:             {
            required:      true,
            trim:          true,
            type:          String,
            minlength:     1,
            unique:        true,
            validate:      {
                isAsync:   true,
                validator: validator.isEmail,
                message:   '{VALUE} is not a valid email'
            }
        },
        password:          {
            type:          String,
            required:      true,
            minLength:     6
        },
        tokens:            [{
            access:        {
                type:      String,
                required:  true
            },
            token:         {
                type:      String,
                required:  true
            }
        }]   
    })


UserSchema.methods.toJSON = function(){
    let userObject = this.toObject();
    return _.pick(userObject,['_id','email','name']);
};

UserSchema.methods.generateAuthToken = function(){
    let access = 'auth';
    let  token = jwt.sign({_id:this._id.toHexString(), access},process.env.JWT_SECRET).toString();
    this.tokens.push({access,token});
    return this.save().then(()=>{
        return token
    });
}; 

UserSchema.statics.findByToken = function(token){
    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
};

UserSchema.statics.findByCredentials = function(email, password){
    return this.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });

    });
};

UserSchema.methods.removeToken = function(token){
    //find any token inside tokens array that is same as our token and update it
    // useing $pull operator wich deletes it
   return this.update({
        $pull:{
            tokens:{token}
        }
    });
}

UserSchema.pre('save', function(next){
    //check if on save the password is changed;
    if(this.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(this.password,salt,(err,hash)=>{
            this.password = hash;
            next();
        });
    });
    }else{
        next();
    }
    
})

let User         = mongoose.model('User',UserSchema);
module.exports   = {User};