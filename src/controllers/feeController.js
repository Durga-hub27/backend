const Fee = require('../models/Fee');

// @desc    Get all fee records
// @route   GET /api/fees
// @access  Public
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get financial summary/report
// @route   GET /api/fees/report
// @access  Public
const getFinancialReport = async (req, res) => {
  try {
    const totalCollected = await Fee.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingFees = await Fee.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const overdueFees = await Fee.aggregate([
      { $match: { status: 'Overdue' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const collectionByType = await Fee.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    // Format for Recharts (yearly trend - mock data for past years + real for current)
    const currentYear = new Date().getFullYear();
    const yearlyTrend = [
      { year: (currentYear - 2).toString(), collected: 650000 },
      { year: (currentYear - 1).toString(), collected: 810000 },
      { year: currentYear.toString(), collected: totalCollected[0]?.total || 0 }
    ];

    res.json({
      summary: {
        totalCollected: totalCollected[0]?.total || 0,
        pendingTotal: pendingFees[0]?.total || 0,
        pendingCount: pendingFees[0]?.count || 0,
        overdueTotal: overdueFees[0]?.total || 0,
        overdueCount: overdueFees[0]?.count || 0
      },
      collectionByType,
      yearlyTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new fee record
// @route   POST /api/fees
// @access  Public
const addFee = async (req, res) => {
  try {
    const { studentId, studentName, amount, type, dueDate, status } = req.body;
    const fee = new Fee({
      studentId,
      studentName,
      amount,
      type,
      dueDate,
      status: status || 'Pending'
    });
    const savedFee = await fee.save();
    res.status(201).json(savedFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Refresh financial report (alias)
// @route   GET /api/fees/report/refresh
// @access  Public
const refreshReport = async (req, res) => {
  // Reuse the existing financial report logic
  return getFinancialReport(req, res);
};

module.exports = {
  getFees,
  getFinancialReport,
  addFee,
  refreshReport
};
