const DocumentController = require('../controllers/document');

module.exports = function(router) {
  router.route('/documents')
  .post(DocumentController.create)
  .get(DocumentController.getAll);

  router.route('/documents/:document_id')
  .get(DocumentController.getDocumentById)
  .put(DocumentController.updateDocumentById)
  .delete(DocumentController.deleteDocumentById);

  router.route('/users/:creator_id/documents')
  .get(DocumentController.getByCreatorId);

  router.route('/documents/date/:date/:limit')
  .get(DocumentController.getByDatePublished);

  router.route('/documents/limit/:limit')
  .get(DocumentController.getDocumentsWithLimit);

  router.route('/documents/access/public')
  .get(DocumentController.getPublicDocuments);

  // TODO: [Restricted] Search public documents for title and content for phrase
  // router.route('/documents/:search_string')
  // .get(DocumentController.search);
};
