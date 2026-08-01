const Application = require('../models/Application');

const VALID_STATUSES = [
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected'
];

exports.getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status, wishlist } = req.query;

    const query = { userId };

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ companyName: regex }, { role: regex }];
    }

    if (status && status.trim() !== '' && status !== 'All') {
      query.status = status.trim();
    }

    if (wishlist === '1' || wishlist === 'true') {
      query.isWishlist = true;
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });

    // Calculate summary statistics
    const allUserApps = await Application.find({ userId });

    const stats = {
      totalApplied: allUserApps.length,
      totalActive: 0,
      totalOffers: 0,
      totalRejected: 0,
      byStatus: {
        'Applied': 0,
        'Online Assessment': 0,
        'Technical Interview': 0,
        'HR Interview': 0,
        'Selected': 0,
        'Rejected': 0
      }
    };

    allUserApps.forEach(app => {
      if (stats.byStatus[app.status] !== undefined) {
        stats.byStatus[app.status] += 1;
      }
      if (app.status === 'Selected') {
        stats.totalOffers += 1;
      } else if (app.status === 'Rejected') {
        stats.totalRejected += 1;
      } else {
        stats.totalActive += 1;
      }
    });

    res.json({ applications, stats });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

exports.addApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, role, applicationDate, status, notes, isWishlist, salary, location } = req.body;

    if (!companyName || !role || !applicationDate || !status) {
      return res.status(400).json({ message: 'Company Name, Role, Application Date, and Status are required' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const application = await Application.create({
      userId,
      companyName: companyName.trim(),
      role: role.trim(),
      applicationDate: applicationDate.trim(),
      status: status.trim(),
      notes: notes ? notes.trim() : '',
      isWishlist: Boolean(isWishlist),
      salary: salary ? salary.trim() : '',
      location: location ? location.trim() : ''
    });

    res.status(201).json({ message: 'Application added successfully', application });
  } catch (error) {
    console.error('Error adding application:', error);
    res.status(500).json({ message: 'Server error adding application' });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { companyName, role, applicationDate, status, notes, isWishlist, salary, location } = req.body;

    const application = await Application.findOne({ _id: id, userId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    if (companyName !== undefined) application.companyName = companyName.trim();
    if (role !== undefined) application.role = role.trim();
    if (applicationDate !== undefined) application.applicationDate = applicationDate.trim();
    if (status !== undefined) application.status = status.trim();
    if (notes !== undefined) application.notes = notes.trim();
    if (isWishlist !== undefined) application.isWishlist = Boolean(isWishlist);
    if (salary !== undefined) application.salary = salary.trim();
    if (location !== undefined) application.location = location.trim();

    await application.save();

    res.json({ message: 'Application updated successfully', application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error updating application' });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const application = await Application.findOneAndDelete({ _id: id, userId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully', id });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error deleting application' });
  }
};
