const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { Schema } = mongoose;

const exerciseSchema = new Schema([
  {
    description: String,
    duration: Number,
    date: Date,
  },
]);

const personSchema = new Schema({
  username: { type: String, unique: true },
  _id: {
    type: String,
    default: () => nanoid(10),
  },
  log: [exerciseSchema],
});

exports.personSchema = personSchema;
exports.exerciseSchema = exerciseSchema;
