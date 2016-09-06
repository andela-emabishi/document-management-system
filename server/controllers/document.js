const Document = require('../models/document');

module.exports = {
  create: (req, res) =>  {
    // Create document with a unique title
    var document = new Document();

    document.title = req.body.title;
    document.content = req.body.content;
    document.privacy = req.body.privacy;
    document._creatorId = req.decoded.id;

    document.save(function(err) {
      if (err) {
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'Document created successfully'
        });
      }
    });
  },

  // Get all documents
  // TODO: Should only be able to get your documents and public documents

  getAll: (req, res) => {
    Document.find(function(err, documents) {
      if(err) {
        res.send(err);
      }
      else {
        res.json(documents);
      }
    });
  },

  getDocumentById: (req, res) => {
    Document.findById(req.params.document_id, function(err, document) {
      if (err) {
        // Something happened and we can't find the user
        res.send(err);
      }
      else {
        res.json(document);
      }
    });
  },

  updateDocumentById: function(req, res) {
    Document.findById(req.params.document_id, function(err, document) {
      if (err) {
        res.send(err);
      }
      // Only update if a change has happened
      if (req.body.title) document.title = req.body.title;
      if (req.body.content) document.content = req.body.content;
      if (req.body.privacy) document.privacy = req.body.privacy;

      // Then save the user details
      document.save(function(err) {
        // If there's an error, tell us
        if (err) {
          res.send(err);
        }
        // Everything went well
        else {
          res.json({
            success: true,
            message: 'Document details updated successfully'
          });
        }
      });
    });
  },

  deleteDocumentById: function(req, res) {
    Document.remove({
      _id: req.params.document_id
    }, function(err) {
      if (err) {
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'Document deleted successfully'
        });
      }
    });
  },

  // Find all documents that belong to a particular user of a certain user id
  // [Restricted] One must only see their own documents or public documents
  getByCreatorId: function(req, res) {
    Document.find({_creatorId: req.decoded.id})
          .exec(function (err, documents) {
            if (err) {
              res.send(err);
              return;
            }
            // documents is an array of documents
            else if (documents[0] == null) {
              res.json({
                message: 'No documents were found for that user'
              });
            } else {
              res.send(documents);
            }
          });

  },

  // GET all documents created on a specific date (query: date, limit)
  // TODO: Enable document fetch using date part of createdAt field
  getByDatePublished: (req, res) => {
    Document.find({
      createdAt : req.params.date
    }).limit(parseInt(req.params.limit))
    .exec(function(err,documents) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(documents);
      }
    });
  },

  // A route that (query: limit) returns all the documents in order of the dates they were created (ascending or descending).
  // It should also return results based on the limit.
  // TODO: Merge with documents/date/limit route? If date param is null, fetch all documents regardless of created date
  getDocumentsWithLimit: (req, res) => {
    Document.find()
     .limit(parseInt(req.params.limit))
     .exec(function(err,documents) {
       if (err) {
         res.send(err);
       }
       else {
         res.send(documents);
       }
     });
  },

  // GET all public documents
  // Set 'public' in route as param to enable get private docs. Document.find({privacy: req.params.public})
  getPublicDocuments: (req, res) => {
    Document.find({privacy: 'public'})
      .exec(function(err, documents) {
        if (err) {
          res.send(err);
          res.json({
            success: false,
            message: 'Cannot get private documents that are not the logged in users'
          });
        }
        else {
          res.send(documents);
        }
      });
  },

  // Search document title or content for a phrase
  // Works with word strings i.e bull winter - will evaluate as OR
  // Possible phrase capability
  search: (req, res) => {
    // To create the index on the documents collection, do this in the terminal
    // db.documents.createIndex({"title":"text","content":"text"})

    Document.find({$text:{$search:req.params.search_string}},{score:{$meta:'textScore'}}).sort({score:{$meta:'textScore'}})
    // Hide private documents from search. To enable search for all documents, omit line below
    .where('privacy').equals('public')
    .exec(function(err, documents) {
      if (err) {
        return res.send(err);
      }
      else {
        // No results for the search
        if (documents[0] == null) {
          return res.send('No results found.');
        }
        else {
          return res.json(documents);
        }
      }
    });
  },

  // TODO
  // getByRole: (req, res) => {
  //   // Find all documents that can be accessed by a certain role
  //
  // },
};
