const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
    default: 'Pending'
  },
  score: {
    type: String,
    default: '0%'
  }
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
