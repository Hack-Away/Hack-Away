const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const userSchema = new Schema({
    name: {
        type:String,
        required: 'User name is mandatory'
    },
    role: {
        type:String,
        enum:['admin', 'user', 'costumer' ,'guest'],
        required: 'The role is mandatory',
        default: 'user'
    },
    password:{
        type:String ,
        required: 'Password is required',
        minlength: [8, 'Password at least have to be 8 char']
    },
    email:{
        type: String,
        required: 'Password is required',
        // duda
       // match: [8, 'Password needs at least 8 chars'],
        lowercase: true,
        trim: true,
        unique: true
    },
    adult:{
        type: Boolean,
        required: 'Under age is mandatory'
    },
    phone:{
        type: String,
        required: 'Phone is mandatory'
    },
    image:{
        type: String,
        default: '',
    },
    kitchen:{
        type:String,
        enum:['Mediterranean', 'Chinese', 'Mexican' ,'Arabic', 'Indian','italian'],
        required: 'The  is mandatory'
    },
    favorites:{
        type:String,
        enum:['Mediterranean', 'Chinese', 'Mexican' ,'Arabic', 'Indian','italian']
            
        }


});

const User = mongoose.model('User', userSchema);

module.exports = User;
