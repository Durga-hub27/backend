const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Tuition', 'Hostel', 'Exam', 'Transport', 'Library'],
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
