const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  profileImage:{
    type: String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    required:true,
    unique:true
  },
  Role:{
    type: String,
    default: "user"
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  phone: {
    type: String,
    required:true,
    unique:true
  },
  DateOfBirth: {
    type: Date,
    required:true
  },
  password:{
    type: String,
    required:true,
  },
  Terms:{
    type: Boolean,
    required:true
  },
  AccountCreated:{
    type: Date,
    default: Date.now
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  VerifyToken:{type:String},
  TokenExpires:{type:Date}
})
module.exports = mongoose.model("User",UserSchema);