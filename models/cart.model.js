const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    'restaurant.id':{
        type: String, 
        required: true
    },
    productList:[{
                required:true,
                'product.id':{
                            type:String,
                            require:true
                            },
                'product.qty': {
                             type:Number,
                             required:true
                            },
                             product :{
                                    price:{
                                         type:Number,
                                         required: 'Price is mandatory'
                                    },
                                    qty: {
                                        type:Number,
                                        required:true
                                    }
        }
        /*
        'product.price':{
        type: Number,
           required:true
       
    }
 */
        }],
    message:{
        type:String
    },
    stateMachine:{
        type: String,
        required: true,  
        default:['no valido'],
        enum : ['no-valido','procesado','comprado','expirado'],
        required:true
    }  
}, {timestamps:true});

module.exports = mongoose.model('Order', schema);