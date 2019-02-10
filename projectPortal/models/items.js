const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    location: String,
    lastSeen: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Item',itemSchema);