const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//nuevo
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^.{8,}$/;

const userSchema = new Schema({
    name:{
        type:String,
        required: 'User name is mandatory',
        trim: true
    },
    role:{
        type:String,
        enum:['admin', 'user', 'costumer' ,'guest'],
        //required: 'The role is mandatory',
        default: 'user'
    },
    password:{
        type:String ,
        required: 'Password is required',
        match: [PASSWORD_PATTERN, 'Password at least have to be 8 chars'] 
    },
    email:{
        type: String,
        required: 'Password is required',
        // duda es necesaria nuevo
        match: [EMAIL_PATTERN, 'Invalid '],
        lowercase: true,
        trim: true,
        unique: true
    },
    adult:{
        type: Boolean,
        //required: 'Under age is mandatory'
    },
    phone:{
        type: String,
        //required: 'Phone is mandatory'
    },
    image:{
        type: String,
        default: '',
    },
    kitchen:{
        type:String,
        enum:['Mediterranean', 'Chinese', 'Mexican' ,'Arabic', 'Indian','italian'],
        //required: 'The  is mandatory'
    },
    favorites:{
        type:String,
        enum:['Mediterranean', 'Chinese', 'Mexican' ,'Arabic', 'Indian','italian']
            
        }
//The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
