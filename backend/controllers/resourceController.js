const Resource = require('../models/Resource');

const VALID_CATEGORIES = [
  'DSA',
  'Aptitude',
  'Resume',
  'Interview Experience',
  'Core Subjects'
];

exports.getResources = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, search } = req.query;

    const query = { userId };

    if (category && category.trim() !== '' && category !== 'All') {
      query.category = category.trim();
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json({ resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server error fetching resources' });
  }
};

exports.addResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, link, description } = req.body;

    if (!title || !category || !link) {
      return res.status(400).json({ message: 'Title, Category, and Link are required' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const resource = await Resource.create({
      userId,
      title: title.trim(),
      category: category.trim(),
      link: link.trim(),
      description: description ? description.trim() : ''
    });

    res.status(201).json({ message: 'Resource added successfully', resource });
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ message: 'Server error adding resource' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const resource = await Resource.findOneAndDelete({ _id: id, userId });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully', id });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server error deleting resource' });
  }
};
