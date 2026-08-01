const Offer = require('../models/Offer');

exports.getOffers = async (req, res) => {
  try {
    const userId = req.user.id;
    const offers = await Offer.find({ userId }).sort({ createdAt: -1 });
    res.json({ offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Server error fetching offers' });
  }
};

exports.addOffer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company, role, ctc, base, stocks, joiningBonus, location, workMode, rating } = req.body;

    if (!company || !role || !ctc) {
      return res.status(400).json({ message: 'Company Name, Role, and Total CTC are required' });
    }

    const newOffer = await Offer.create({
      userId,
      company: company.trim(),
      role: role.trim(),
      ctc: ctc.trim(),
      base: base ? base.trim() : '',
      stocks: stocks ? stocks.trim() : '',
      joiningBonus: joiningBonus ? joiningBonus.trim() : '',
      location: location ? location.trim() : '',
      workMode: workMode || 'Hybrid',
      rating: rating || '4.5 / 5'
    });

    res.status(201).json({ message: 'Offer added successfully', offer: newOffer });
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ message: 'Server error adding offer' });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const offer = await Offer.findOneAndDelete({ _id: id, userId });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json({ message: 'Offer deleted successfully', id });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Server error deleting offer' });
  }
};
