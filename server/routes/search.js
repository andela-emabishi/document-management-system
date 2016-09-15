const SearchController = require('../controllers/search');

module.exports = (router) => {
  router.route('/search/date')
  .get(SearchController.getByDatePublished);

  // [Restricted route] Search public documents for title and content for phrase
  router.route('/search/string')
  .get(SearchController.search);

  router.route('/search/role')
  .get(SearchController.getByRole);
};
