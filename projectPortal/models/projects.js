const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    department:{
        type: String,
    },
    projectBy:String,
    isOpen: {
        type: Boolean,
        default: true
    },
    peopleInterested: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps:true});

projectSchema.methods.addPeopleInterested = function(user_id){
    if(this.peopleInterested.indexOf(user_id) === -1 ){
        this.peopleInterested.push(user_id)
    }
    return this.save();
};

mongoose.model('Project',projectSchema);