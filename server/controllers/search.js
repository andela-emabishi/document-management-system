const Document = require('../models/document');

module.exports = {
    // GET all documents created on a specific date (query: date, limit)
    //  [Restricted] Cannot get private documents not yours
  getByDatePublished: (req, res) => {
    const startDate = new Date(req.query.date);
    const endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));

    Document.find({
      $and: [
        { $or: [{ _creatorId: req.decoded.id }, { privacy: 'public' }] },
        { createdAt: { $gte: startDate, $lt: endDate } },
      ],
    })
    .sort('-createdAt')
    .limit(parseInt(req.query.limit, 10))
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else if (documents.length === 0) {
        res.status(404).send({
          message: 'No documents found that were published on that date',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(documents);
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
        Document.find({ $text: { $search: req.query.search_string } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
        .exec(function(err, documents) {
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
    Document.find({ access: req.query.role })
    .limit(parseInt(req.query.limit, 10))
    .exec((err, documents) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(documents);
      }
    });
  },
};
