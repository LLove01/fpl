var express = require('express');
var router = express.Router();
var fplDataController = require('../controllers/fplDataController.js');

/*
 * GET
 */
router.get('/:id', fplDataController.getManagerData);

module.exports = router;