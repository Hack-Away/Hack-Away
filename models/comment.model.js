const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = ({
    idProduct:{
        type:String,
        required: true,
    },
    title:{
        type:String,
        required: 'Title is required',
        minLength:[5, 'Title needs 5 chars']
    }, 
    message:{
        type:String,
        required: 'Message is required',
        minLength:[50, 'Comment needs 50 chars']
    },
    rating:{
        type:Number,
        required: 'Rate is required',
        enum:[1,2,3,4,5]
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;