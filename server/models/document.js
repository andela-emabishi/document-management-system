const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  // A public document can be seen by everybody
  /* A private document can only be seen by the person who created it,
  * a role that has access to it
  * and anyone who the owner shared the document with
  */

const DocumentSchema = new Schema({
  // Different from the document's own document-id
  // Will be populated from the User models's id field
  _creatorId: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
    unique: false,
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
  privacy: {
    enum: ['public', 'private'],
    required: true,
    type: String,
  },
  sharewith: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: false,
  },
  access: {
    ref: 'Role',
    type: Schema.Types.ObjectId,
    required: false,
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
