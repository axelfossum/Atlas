const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
    title: {type: String, required: true},
    course: {type: String, required: false},
    description: {type: String, required: false},
    deadline: {type: Date, required: true},
    user: {type: String, required: true},
    finished: {type: Boolean, required: true}
}, {
    timestamps: true
});

const Tasks = mongoose.model('Tasks', tasksSchema);

module.exports = Tasks;