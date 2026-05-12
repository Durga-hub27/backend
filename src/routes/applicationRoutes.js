const express = require('express');
const router = express.Router();
const { getApplications, createApplication, exportApplications } = require('../controllers/applicationController');

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.get('/export', exportApplications);

module.exports = router;
