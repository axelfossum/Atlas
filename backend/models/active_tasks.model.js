const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeTasksSchema = new Schema({
    title: {type: String, required: true},
    course: {type: String, required: false},
    description: {type: String, required: false},
    deadline: {type: Date, required: true}
}, {
    timestamps: true
});

const ActiveTasks = mongoose.model('Active tasks', activeTasksSchema);

module.exports = ActiveTasks;