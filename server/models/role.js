const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  roleId: {
    required: true,
    type: Number,
    unique: true,
  },
  title: {
    required: true,
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('Role', roleSchema);
