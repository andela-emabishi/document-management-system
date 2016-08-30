const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
});

module.exports = mongoose.model('Document', documentSchema);
