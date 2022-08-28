const mongoose = require('mongoose');

const product_schema = new mongoose.Schema({
    product_name: {type: 'string', required: true},
    price : {type: 'number', required: true},
    description : {type: 'string', required: true},
    profileImg: {type: 'string'},
    owner : {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
},{timestamp:true});

module.exports = mongoose.model('Product',product_schema);