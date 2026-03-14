const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required : [true,"Please add a name"]
    },
    email:{
        type:String,
        required: [true, "Please add an email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"]
    },
    password:{
        type: String, 
        required: [true, "Please add a password"], 
        select: false
    },
    groups:[{
        type: mongoose.Schema.type.ObjectId,
        ref: 'Group'
    }],
    createdAt: {
    type: Date,
    default: Date.now
  }
});

modules.export = mongoose.model('User',UserSchema);