const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coursesSchema = new Schema({
    coursename: {type: String},
    coursecolor: {type: String}
});

const usersSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    courses: [coursesSchema]
}, {
    timestamps: true
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;