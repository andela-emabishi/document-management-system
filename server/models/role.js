const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// read == read all public documents + their own & assigned documents? OR read ALL documents?
//  readWrite === read all public documents + their own, write assigned documents(private or public) OR read& write all documents
// readWriteDelete === read,edit and delete public documents + assigned private documents
// delete: admin === delete hashed private documents

const roleSchema = new Schema({
  title: {
    // enums: roleTypes,
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
