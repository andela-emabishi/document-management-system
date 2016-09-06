const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // A public document can be seen by everybody
  // A private document can only be seen by the person who created it
  // var privacyLevel = ['public', 'private'];

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
  // sharewith: {
  //   ref: 'User',
  //   // Use username instead?
  //   type: Schema.Types.ObjectId,
  //   required: false,
  // },
  // access: {
  //   ref: 'Role',
  //   // Use permission title instad?
  //   type: Schema.Types.ObjectId,
  //   required: false,
  // }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
