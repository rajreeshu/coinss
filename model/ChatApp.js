const mongoose = require('mongoose');

chatApp_scheme = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    message:{type:'string', required: true}
},{timestamp:true});
module.exports = mongoose.model('ChatApp',chatApp_scheme);