const DocumentController = require('../controllers/document');

module.exports = (router) => {
  router.route('/documents')
    .post(DocumentController.create)
    .get(DocumentController.getAll);

  router.route('/documents/:document_id')
    .get(DocumentController.getDocumentById)
    .put(DocumentController.updateDocumentById)
    .delete(DocumentController.deleteDocumentById);

  router.route('/users/:creator_id/documents')
    .get(DocumentController.getByCreatorId);

  router.route('/documents/access/public')
    .get(DocumentController.getPublicDocuments);

  router.route('/share')
    .get(DocumentController.getBySharedWith);
};
