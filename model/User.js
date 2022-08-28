const mongoose = require('mongoose');  
 
const userSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    email: {type: 'string', required: true, unique: true},
    password: {type: 'string', required: true},
    gender: {type: 'string'},
    favouriteProduct:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}],
    isAdmin: {type: 'string', default: false},
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);