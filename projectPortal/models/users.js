const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    projectsPosted: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    projectsInterested: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Projects'
        }
    ]
},{timestamps:true});

userSchema.methods.addProjectPosted = function (project_id) {
    if(this.projectsPosted.indexOf(project_id) === -1 ){
        this.projectsPosted.push(project_id)
    }
    return this.save();
};

userSchema.methods.addProjectInterested = function(project_id) {
    if(this.projectsInterested.indexOf(project_id) === -1 ){
        this.projectsInterested.push(project_id)
    }
    return this.save();
}

mongoose.model('User',userSchema);