const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // A public document can be seen by everybody
  // A private document can only be seen by the person who created it
  // var privacyLevel = ['public', 'private'];

const DocumentSchema = new Schema({
  // Different from the document's own document-id
  _creatorId: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
    unique: true,
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
    required: true,
  },
  modifiedAt: {
    default: Date.now,
    type: Date,
    required: true,
  },
  privacy: {
    enum: ['public', 'private'],
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
