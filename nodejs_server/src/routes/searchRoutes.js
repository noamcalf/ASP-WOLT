/**
 * Search Router
 * Maps global search endpoints to the appropriate controller functions.
 */
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Bind GET requests for global search using the dynamic :query parameter
router.route('/:query')
    .get(searchController.searchGlobal);

module.exports = router;