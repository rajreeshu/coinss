const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    productId:{type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
    review:{type:String,required:true},
},{timestamp:true});
module.exports =mongoose.model('Review',reviewSchema);