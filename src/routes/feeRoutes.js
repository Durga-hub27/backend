const express = require('express');
const router = express.Router();
const { getFees, getFinancialReport, addFee, refreshReport } = require('../controllers/feeController');

router.route('/')
  .get(getFees)
  .post(addFee);

router.get('/report', getFinancialReport);
router.get('/report/refresh', refreshReport);

module.exports = router;
