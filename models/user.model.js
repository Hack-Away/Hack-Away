const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//nuevo
const bcrypt = require('bcrypt');
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
        enum:['admin', 'user', 'costumer'],
        //required: 'The role is mandatory',
        default: 'costumer'
    },
    password:{
        type:String ,
        required: 'User password is required',
        match: [PASSWORD_PATTERN, 'Password at least have to be 8 chars'] 
    },
    social: {
        google:String
    },
    email:{
        type: String,
        required: 'User e-mail is required',
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
        enum:['Mediterranean', 'Chinese', 'Mexican' ,'Arabic', 'Indian','Italian'],
        //required: 'The  is mandatory'
    },
    favorites:{
        type:String,
        enum:['Mediterranean', 'Chinese', 'Mexican' ,'Arabic', 'Indian','Italian']
            
    },
    verified: {
        date: Date,
        token: {
            type: String,
            default: () => 
            Math.random().toString(36).substr(2)+
            Math.random().toString(36).substr(2)+
            Math.random().toString(36).substr(2)+
            Math.random().toString(36).substr(2)+
            Math.random().toString(36).substr(2)
        }
    },
    avatar:{
        type: String,
        default: function() {
            return `https://i.pravatar.cc//150?u=${this.id}`
        }
    },
    description: {
        type: String,
        default: 'A few words about your restaurant...'
    }, 
    adress: {
        type: String,
        default: 'Calle Inventada, nº random'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Order'
    },
    oldOrders: [{
             orders: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            },
    }]
}, {timestamps: true});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
