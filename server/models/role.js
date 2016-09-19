const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  title: {
    required: true,
    type: String,
    unique: true,
  },
  permission: {
    required: true,
    type: String,
    enum: ['read', 'readWrite', 'readWriteDelete', 'delete'],
    unique: false,
  },
});

module.exports = mongoose.model('Role', roleSchema);
