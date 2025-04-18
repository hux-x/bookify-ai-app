import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
   
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'User registered successfully', user: newUser,token});
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id
    const { username, email, bio, favoriteGenres } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio, favoriteGenres },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};
// Get user personal information
export const getUserPersonalInfo = async (req, res) => {
  console.log("testing func")
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('username email bio profilePicture favoriteGenres');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ personalInfo: user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user personal information', error: error.message });
  }
};

// Get user reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('reviews').populate('reviews.bookId', 'title author');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ reviews: user.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reviews', error: error.message });
  }
};

// Get user's reading list
export const getUserReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('readingList').populate('readingList.bookId', 'title author');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ readingList: user.readingList });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reading list', error: error.message });
  }
};
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, bio, favoriteGenres, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, bio, favoriteGenres, profilePicture },
      { new: true, runValidators: true }
    ).select('username bio favoriteGenres profilePicture');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Personal information updated successfully', personalInfo: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update personal information', error: error.message });
  }
};
export const updateReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update if book exists in the list, or add a new one
    const existingBook = user.readingList.find((entry) => entry.bookId.toString() === bookId);

    if (existingBook) {
      existingBook.status = status;
    } else {
      user.readingList.push({ bookId, status });
    }

    await user.save();

    res.status(200).json({ message: 'Reading list updated successfully', readingList: user.readingList });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reading list', error: error.message });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.reviews = user.reviews.filter((review) => review._id.toString() !== reviewId);

    await user.save();

    res.status(200).json({ message: 'Review deleted successfully', reviews: user.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

export const addCurrentlyReading = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user._id
console.log(userId)
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.currentlyReading = { bookId }; // Replace the currently reading book
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      message: 'Book added to currently reading list',
      currentlyReading: user.currentlyReading,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
export const getCurrentlyReading = async (req, res) => {
  const  userId  = req.user._id;
  console.log(userId)
  try {
    const user = await User.findById(userId).populate('currentlyReading.bookId');
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user.currentlyReading)
    res.status(200).json({
      message: 'Currently reading book retrieved successfully',
      currentlyReading: user.currentlyReading,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
