const mongoose = require('mongoose');
const Nhietdodoam = new mongoose.Schema({
    nhietdo:{type:Number, default:'0'},
    doam:{type:Number, default:'0'},
    createAt: Date,
    expiresAt: Date
},  {
    timestamps:true
})
const nhietdodoam = mongoose.model('nhietdodoam',Nhietdodoam);
module.exports = nhietdodoam;