const Document = require('../models/document');

module.exports = {
  // Create document with a unique title
  create: (req, res) => {
    const document = new Document();

    document.title = req.body.title;
    document.content = req.body.content;
    document.privacy = req.body.privacy;
    document._creatorId = req.decoded.id;
    document.sharewith = req.body.sharewith;
    document.access = req.body.access;

    document.save((err) => {
      if (err) {
        res.status(500).send({
          error: err,
          message: 'Document could not be created',
          status: '500: Internal Server Error',
        });
      } else {
        res.status(201).send({
          success: true,
          message: 'Document created successfully',
          status: '201: Resource Created',
        });
      }
    });
  },

  // Get all documents
  // [Restricted] Only able to get your documents and public documents
  getAll: (req, res) => {
    Document.find(
      {
        $or: [{ _creatorId: req.decoded.id }, { privacy: 'public' }],
      }
    )
    .sort('-createdAt')
    .skip(parseInt(req.query.offset, 10))
    .limit(parseInt(req.query.limit, 10))
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else if (parseInt(req.query.offset, 10) > documents.length) {
        res.status(400).send({
          success: false,
          message: 'Offset greater than number of documents or limit param. Cannot fetch',
          status: '400: Bad request',
        });
      } else {
        res.status(200).send(documents);
      }
    });
  },

// [Restricted] Can only fetch documents of logged in user
  getDocumentById: (req, res) => {
    Document.findById(req.params.document_id)
    .where('_creatorId').equals(req.decoded.id)
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else if (!documents) {
        res.status(401).send({
          success: false,
          message: 'Cannot access document by that id',
          status: '401: Unauthorised',
        });
      } else {
        res.status(200).send(documents);
      }
    });
  },

  // [Restricted] Can only edit documents of logged in user
  updateDocumentById: (req, res) => {
    Document.findById(req.params.document_id)
    .where('_creatorId').equals(req.decoded.id)
    .exec((err, document) => {
      if (err || document === null) {
        res.status(404).send({
          error: err,
          message: 'Could not update document by the id entered',
          status: '404: Resource Not Found',
        });
      }
       // Only update if a change has happened
      if (req.body.title) document.title = req.body.title;
      if (req.body.content) document.content = req.body.content;
      if (req.body.privacy) document.privacy = req.body.privacy;
      if (req.body.sharewith) document.sharewith = req.body.sharewith;
      if (req.body.access) document.access = req.body.access;

      // Then save the user details
      document.save((err) => {
        // If there's an error, tell us
        if (err) {
          res.status(401).send({
            error: err,
            message: 'Error saving document',
            status: '401: Unauthorised',
          });
        } else {
          res.status(200).send({
            success: true,
            message: 'Document details updated successfully',
          });
        }
      });
    });
  },

// [Restricted] To logged in user
  deleteDocumentById: (req, res) => {
    Document.find()
    .where('_creatorId').equals(req.decoded.id)
    .exec((err) => {
      if (err) {
        res.send(err);
      } else {
        Document.remove(
          {
            $and: [{ _creatorId: req.decoded.id }, { _id: req.params.document_id }],
          }
      , function(err) {
          if (err) {
            res.status(500).send({
              error: err,
              message: 'Error deleting document',
              status: '500: Server Error',
            });
          } else {
            res.status(200).send({
              success: true,
              message: 'Document Deleted successfully if document was yours. Failed to delete another users\' documents',
            });
          }
        });
      }
    });
  },

  // Find all documents that belong to a particular user of a certain user id
  // [Restricted] One must only see their own documents or public documents
  getByCreatorId: (req, res) => {
    Document.find(
      {
        $or: [
          { $and: [{ _creatorId: req.params.creator_id }, { privacy: 'public' }] },
          { $and: [{ _creatorId: req.decoded.id }] },
        ],
      }
    )
      .exec((err, documents) => {
        if (err) {
          res.send(err);
          return;
        } else if (documents[0] == null) {
          res.status(404).send({
            message: 'No documents were found for that user. The document you are referring to may be private',
            status: '404: Resource Not Found',
          });
        } else {
          res.status(200).send(documents);
        }
      });
  },

  // GET all documents created on a specific date (query: date, limit)
  //  [Restricted] Cannot get private documents not yours

  getByDatePublished: (req, res) => {
    const startDate = new Date(req.query.date);
    const endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));

    Document.find({
      $or: [
        { $and: [{ createdAt: req.query.date }, { privacy: 'public' }] },
        { $and: [{ _creatorId: req.decoded.id }, { createdAt: req.query.date }] },
        { $and: [{ createdAt: { $gte: startDate, $lt: endDate } }, { privacy: 'public' }] },
      ],
    })
    .sort('-createdAt')
    .limit(parseInt(req.query.limit, 10))
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(documents);
      }
    });
  },

  // GET all public documents
  // Set 'public' in route as param to enable get private docs. Document.find({privacy: req.params.public})
  getPublicDocuments: (req, res) => {
    Document.find({ privacy: 'public' })
      .exec((err, documents) => {
        if (err) {
          res.send(err);
          res.json({
            success: false,
            message: 'Cannot get private documents that are not the logged in users',
          });
        } else {
          res.send(documents);
        }
      });
  },

    // [Restricted]: Able to search logged in users documents and public documents
  search: (req, res) => {
    // To create the index on the documents collection, do this in the terminal
    // db.documents.createIndex({"title":"text","content":"text"})
    Document.find(
      {
        $or: [{ _creatorId: req.decoded.id }, { privacy: 'public' }],
      }
    )
    .exec(function(err) {
      if (err) {
        res.send(err);
      } else {
        Document.find({ $text: { $search: req.params.search_string } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
        .exec(function (err, documents) {
          if (err) {
            res.send(err);
          } else {
            // No results for the search
            if (documents[0] == null) {
              res.status(404).send({
                success: false,
                message: 'No results found.',
                status: '404: Resource Not Found',
              });
            } else {
              res.json(documents);
            }
          }
        });
      }
    });
  },

  getByRole: (req, res) => {
    // Find all documents that can be accessed by a certain role
    Document.find({ access: req.params.role })
    .limit(parseInt(req.params.limit, 10))
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else {
        res.json(documents);
      }
    });
  },

  getBySharedWith: (req, res) => {
    Document.find({ sharewith: req.params.share })
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else if (!documents[0]) {
        res.status(404).send({
          message: 'No documents have been shared with you',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(documents);
      }
    });
  },
};
