const express = require('express');
const DocumentController = require('../controllers/document');

const router = express.Router();

// On all routes that end in /documents, do this:
router.route('/documents')
  .post(DocumentController.create),
  .get(DocumentController.all);

router.route('/documents/:id')
  .get(DocumentController.findById),
  .put(DocumentController.update),
  .delete(DocumentController.deleteById);

router.route('/documents/results')
  .get(DocumentController.search);

router.route('/users/:id/documents')
  .get(DocumentController.findByUser);

module.exports = router;
