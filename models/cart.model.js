const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    createdBy:{
        type: String, 
        required: true
    },
    productList:[{
        product:{
            price:{
                type: Number,
                required: true
            },
            qty:{
                type:Number,
                required: true
            },
            name:{
                type:String,
                required: true
            }
        },     
 
    }],
    message:{
        type:String
    },
    stateMachine:{
        type: String, 
        default:'no-valido',
        enum : ['no-valido','procesado','comprado','expirado'],
        required:true
    }  
}, {timestamps:true});

const Order = mongoose.model('Order', cartSchema);
module.exports = Order