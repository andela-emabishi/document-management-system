const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// An admin can create, edit and delete a document
// An editor can view and edit a document
// A viewer can only view a document and cannot edit or delete

const roles = ['editor', 'viewer', 'admin'];

const roleSchema = new Schema({
  // Take _id as value generated organically by MongoDB

  _id: {
    required: true,
    type: Schema.Types.ObjectId,
    unique: true,
  },
  title: {
    enum: roles,
    required: true,
    type: String,
  },

});

module.exports = mongoose.model('Role', roleSchema);
