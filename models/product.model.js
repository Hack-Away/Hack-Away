const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        required: 'Product name is mandatory',
    },
    description:{
        type:String,
        minlength: [140, 'Description needs 140 chars at least']
    },
    price:{
        type:Number,
        required: 'Price is mandatory'
    },
    allergies:[{
        type:String,
        required: 'Allergies is mandatory',
        enum: ['eggs', 'fish', 'milk', 'peanuts', 'seafood', 'soy', 'wheat', 'vegetables', 'fruit', 'none']
    }],
    img:{
        type:String,
        default:'',
    },
    productTime:{
        type:Number,
        required: 'Product preparation time is mandatory'
    },
    createdBy:{
        type:String,
        required: true,
    },
    rating: {
        type:Number,
        required:true,
        default: 5,

    }

}, {timestamps:true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;