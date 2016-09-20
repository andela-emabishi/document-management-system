const Document = require('../models/document');

module.exports = {
    // GET all documents created on a specific date (query: date, limit)
    //  [Restricted] Cannot get private documents that belong to other users
  getByDatePublished: (req, res) => {
    const startDate = new Date(req.query.date);
    // i.e. One day after the start date
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
        res.status(500).send({
          error: err,
          message: 'Error fetching documents.',
          status: '500: Server Error',
        });
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

  // [Restricted]: Able to search logged in users' documents and public documents title and content
  search: (req, res) => {
    Document.find(
      {
        $or: [{ _creatorId: req.decoded.id }, { privacy: 'public' }],
      }
    )
    .exec((err) => {
      if (err) {
        res.send(err);
      } else {
        Document.find({ $text: { $search: req.query.search_string } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
        .exec(function(err, documents) {
          if (err) {
            res.send(err);
          } else if (documents.length === 0) {
            res.status(404).send({
              message: 'No results found.',
              status: '404: Resource Not Found',
            });
          } else {
            res.status(200).send(documents);
          }
        });
      }
    });
  },

  // Find all documents that can be accessed by a certain role
  getByRole: (req, res) => {
    Document.find({ access: req.query.role })
    .limit(parseInt(req.query.limit, 10))
    .exec((err, documents) => {
      if (err) {
        res.send({
          error: err,
          message: 'Error fetching documents',
          status: '500: Server Error',
        });
      } else if (documents.length === 0) {
        res.status(404).send({
          message: 'No documents available to that role',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(documents);
      }
    });
  },
};
