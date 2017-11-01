let mongoose     = require('mongoose');
const _          = require('lodash');
let TodoSchema   = new mongoose.Schema({
    title:          {
        type:      String,
        trim:      true,
        required:  true,
        minlength: 1
        },
    description:{
        type:      String,
        trim:      true,
        required:  false,
        minlength: 1
    },
    state:     {
        type:      String,
        default:   'ongoing',
        enum:['onhold','today','urgent','completed','ongoing']
    },
    completedAt:   {
        type:      Number,
        default:   null
    },
    _creator:      {
        type:      mongoose.Schema.Types.ObjectId,
        required:  true
    } 
})

TodoSchema.methods.toJSON = function(){
    let todoObject = this.toObject();
    return _.pick(todoObject,['title','description','state','completedAt','_creator','_id']);
}
let Todo         = mongoose.model('Todo',TodoSchema);

module.exports = {Todo};