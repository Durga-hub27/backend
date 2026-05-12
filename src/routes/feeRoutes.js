const express = require('express');
const router = express.Router();
const { getFees, getFinancialReport, addFee } = require('../controllers/feeController');

router.route('/')
  .get(getFees)
  .post(addFee);

router.get('/report', getFinancialReport);

module.exports = router;
