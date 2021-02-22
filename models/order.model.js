const mongoose = require('mongoose');
const { schema } = require('./user.model');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true
    },
    productList:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',           
            },
            qty:{
                type:Number,
                required: true,
                default: 1
            }
    }],
    message:{
        type:String
    },
    state:{
        type: String, 
        default:'standby',
        enum : ['standby','started','confirmed','finished'],
        required:true
    }, 
    estimatedTime:{
        type: Date
    }
   
}, {timestamps:true});



orderSchema.virtual('order', {
    ref: 'user',
    localField: '_id',
    foreignField: 'order',
    options: {
        limit: 1
    }
})

orderSchema.post('save', function (doc, next) {
    setTimeout(function () {
        console.log('post1');
        next();
    }, 10);
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order