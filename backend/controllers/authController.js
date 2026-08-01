const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'placement_portal_secret';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Account created using social login (Google/GitHub). Please log in using Google or GitHub.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for Google login' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: name ? name.trim() : normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId: googleId || `google_${Date.now()}`,
        avatarUrl: picture || ''
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId || `google_${Date.now()}`;
      }
      if (picture && !user.avatarUrl) {
        user.avatarUrl = picture;
      }
      await user.save();
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Google login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Error in Google Auth:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

exports.githubAuth = async (req, res) => {
  try {
    const { name, email, githubId, avatarUrl } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for GitHub login' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: name ? name.trim() : normalizedEmail.split('@')[0],
        email: normalizedEmail,
        githubId: githubId || `github_${Date.now()}`,
        avatarUrl: avatarUrl || ''
      });
    } else {
      if (!user.githubId) {
        user.githubId = githubId || `github_${Date.now()}`;
      }
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      await user.save();
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'GitHub login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Error in GitHub Auth:', error);
    res.status(500).json({ message: 'Server error during GitHub authentication' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, linkedinUrl, githubUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl.trim();
    if (githubUrl !== undefined) user.githubUrl = githubUrl.trim();

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
