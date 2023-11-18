const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    searchController,
    searchKeywordController
  } = require('../controllers/searchController');
  
  router.get('/search', searchController);
  router.get('/top-search', searchKeywordController);

  module.exports = router;