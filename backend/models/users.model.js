const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false, minlength: 6},
    courses: [String]
}, {
    timestamps: true
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;