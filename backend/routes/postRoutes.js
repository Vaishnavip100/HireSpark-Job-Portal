const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController'); // <-- Import deletePost
const protect = require('../middleware/authMiddleware');

// Route for getting all posts and creating a new one
router.route('/').get(getPosts).post(protect, createPost);

// It is protected, so only logged-in users can attempt to delete.
router.route('/:id').delete(protect, deletePost);

module.exports = router;