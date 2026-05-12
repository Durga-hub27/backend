const Application = require('../models/Application');

// @desc    Get all applications (with optional filters)
// @route   GET /api/applications
// @access  Public
const getApplications = async (req, res) => {
  try {
    const { status, department, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Public
const createApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dob, address, department } = req.body;

    // Simple ID generation for demo
    const count = await Application.countDocuments();
    const applicationId = `ADM-${(count + 1).toString().padStart(3, '0')}`;

    const application = new Application({
      applicationId,
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      department,
      score: `${Math.floor(Math.random() * 40) + 60}%` // Random score for demo
    });

    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Export applications as CSV
// @route   GET /api/applications/export
// @access  Public
const exportApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    
    let csv = 'Application ID,First Name,Last Name,Email,Phone,Department,Status,Score,Date\n';
    
    applications.forEach(app => {
      csv += `${app.applicationId},${app.firstName},${app.lastName},${app.email},${app.phone},${app.department},${app.status},${app.score},${app.createdAt}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('applications.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApplications,
  createApplication,
  exportApplications
};
