const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accessLevel = ['global', 'private'];

const documentSchema = new Schema({
  documentId: {
    required: true,
    type: Number,
  },
  ownerId: {
    required: true,
    type: Number,
  },
  title: {
    required: true,
    trim: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  modifiedAt: {
    default: Date.now,
    type: Date,
  },
  permissions: {
    enums: accessLevel,
    required: true,
  },
});

module.exports = mongoose.model('Document', documentSchema);
