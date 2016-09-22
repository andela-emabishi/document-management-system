const Document = require('../models/document');

module.exports = {
  search: (req, res) => {
    const startDate = new Date(req.query.date);
    // i.e. One day after the start date
    const endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));
    const $query = {
      $and: [
        { $or: [{ _creatorId: req.decoded.id }, { privacy: 'public' }] },
      ],
    };
    // Search by date published
    //  [Restricted] Cannot get private documents that belong to other users
    if (req.query.date) {
      const dateQuery = { createdAt: { $gte: startDate, $lt: endDate } };
      $query.$and.push(dateQuery);
    }
    /* [Restricted]: Able to search logged in users' documents
    * and public documents title and content
    */
    if (req.query.q) {
      const textQuery = { $text: { $search: req.query.q } };
      $query.$and.push(textQuery);
    }
    // Find all documents that can be accessed by a certain role
    if (req.query.role) {
      $query.access = req.query.role;
    }

    Document.find($query)
    .sort('-createdAt')
    .skip(parseInt(req.query.offset || 0, 10))
    .limit(parseInt(req.query.limit || 10, 10))
    .exec((err, documents) => {
      if (err) {
        res.status(500).send({
          error: err,
          message: 'Error fetching documents.',
          status: '500: Server Error',
        });
      } else if (documents.length === 0) {
        res.status(404).send({
          message: 'No documents found.',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(documents);
      }
    });
  },
};
