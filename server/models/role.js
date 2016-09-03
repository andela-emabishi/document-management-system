const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const accessLevel = ['read', 'write', 'delete'];

// const roleTypes = ['viewer', 'editor', 'admin'];

const roleSchema = new Schema({
  title: {
    // enums: roleTypes,
    required: true,
    type: String,
    unique: true
  },
  permission: {
    required: true,
    type: String,
    enum: ['read', 'readWrite', 'readWriteDelete','delete'],
    unique: false,
  }
});

module.exports = mongoose.model('Role', roleSchema);
