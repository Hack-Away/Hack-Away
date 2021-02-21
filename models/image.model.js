const mongoose = require('mongoose');
const path = require('path')
const {Schema} = mongoose;

const ImageSchema = new Schema({
    title:{
        type: String,
    },
    filename:{
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

ImageSchema.virtual('uniqueId')
    .get(function() {
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('Image', ImageSchema);