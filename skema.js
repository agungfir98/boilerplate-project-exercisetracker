const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const {Schema} = mongoose;

const personSchema = new Schema({
    username: {type: String, unique:true},
    _id: {
        type: String,
        default: ()=> nanoid(10),
    },
});

const exerciseSchema = new Schema([{
    username: String,
    description: String,
    duration: Number,
    date: Date,
    _id: {
        type: String,
        default: () => nanoid(10)
    }
}]);


exports.personSchema = personSchema;
exports.exerciseSchema = exerciseSchema;