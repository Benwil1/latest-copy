const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = path.join(uploadDir, file.fieldname);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
    cb(null, subDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.fieldname === 'photos' || file.fieldname === 'apartment_images') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } else if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files per request
  }
});

// Upload user photos
router.post('/photos', upload.array('photos', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const photoUrls = [];

    // Save photo records to database
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const photoId = uuidv4();
      const photoUrl = `/uploads/photos/${file.filename}`;

      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO user_photos (id, user_id, photo_url, order_index)
          VALUES (?, ?, ?, ?)
        `, [photoId, req.userId, photoUrl, i], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      photoUrls.push(photoUrl);
    }

    res.json({
      message: 'Photos uploaded successfully',
      photos: photoUrls
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});

// Upload apartment images
router.post('/apartment-images', upload.array('apartment_images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => `/uploads/apartment_images/${file.filename}`);

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload apartment images error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Upload video
router.post('/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoUrl = `/uploads/video/${req.file.filename}`;

    res.json({
      message: 'Video uploaded successfully',
      video_url: videoUrl
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Delete user photo
router.delete('/photos/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;

    // Get photo info
    const photo = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM user_photos WHERE id = ? AND user_id = ?', [photoId, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete file from filesystem
    const filePath = path.join('.', photo.photo_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM user_photos WHERE id = ?', [photoId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Set primary photo
router.put('/photos/:photoId/primary', async (req, res) => {
  try {
    const { photoId } = req.params;

    // Check if photo belongs to user
    const photo = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM user_photos WHERE id = ? AND user_id = ?', [photoId, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Remove primary flag from all user photos
    await new Promise((resolve, reject) => {
      db.run('UPDATE user_photos SET is_primary = FALSE WHERE user_id = ?', [req.userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Set this photo as primary
    await new Promise((resolve, reject) => {
      db.run('UPDATE user_photos SET is_primary = TRUE WHERE id = ?', [photoId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Primary photo updated successfully' });
  } catch (error) {
    console.error('Set primary photo error:', error);
    res.status(500).json({ error: 'Failed to set primary photo' });
  }
});

module.exports = router;