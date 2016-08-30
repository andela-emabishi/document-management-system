const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: Number,
    unique: true,
  },
  firstName: {
    default: 'John',
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    default: 'Doe',
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  email: {
    default: 'johndoe@gmail.com',
    required: true,
    trim: true,
  },
  password: {
    default: 'pass',
    required: true,
  },
  // Create or Use role relationship from roleSchema
  role: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
