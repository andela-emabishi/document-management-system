const SearchController = require('../controllers/search');

module.exports = (router) => {
  router.route('/search')
  .get(SearchController.search);
};
