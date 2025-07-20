const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { validateRequest, schemas } = require('../middleware/validation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const db = getDatabase();

// Get all apartments (with optional filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      location,
      min_price,
      max_price,
      beds,
      baths,
      property_type,
      amenities,
      page = 1,
      limit = 20
    } = req.query;

    let query = `
      SELECT a.*, u.name as owner_name, u.profile_picture as owner_avatar
      FROM apartments a
      JOIN users u ON a.owner_id = u.id
      WHERE a.active = TRUE AND a.verified = TRUE
    `;
    const params = [];

    // Add filters
    if (location) {
      query += ' AND a.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (min_price) {
      query += ' AND a.price >= ?';
      params.push(parseInt(min_price));
    }

    if (max_price) {
      query += ' AND a.price <= ?';
      params.push(parseInt(max_price));
    }

    if (beds) {
      query += ' AND a.beds >= ?';
      params.push(parseInt(beds));
    }

    if (baths) {
      query += ' AND a.baths >= ?';
      params.push(parseFloat(baths));
    }

    if (property_type) {
      query += ' AND a.property_type = ?';
      params.push(property_type);
    }

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const apartments = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Parse JSON fields and add additional data
    const processedApartments = apartments.map(apartment => ({
      ...apartment,
      images: apartment.images ? JSON.parse(apartment.images) : [],
      amenities: apartment.amenities ? JSON.parse(apartment.amenities) : [],
      landlord: {
        name: apartment.owner_name,
        image: apartment.owner_avatar,
        rating: 4.5, // Mock rating - implement proper rating system
        responseRate: '95%',
        responseTime: 'within a few hours',
        memberSince: '2022'
      }
    }));

    res.json(processedApartments);
  } catch (error) {
    console.error('Get apartments error:', error);
    res.status(500).json({ error: 'Failed to get apartments' });
  }
});

// Get apartment by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await new Promise((resolve, reject) => {
      db.get(`
        SELECT a.*, u.name as owner_name, u.profile_picture as owner_avatar, u.email as owner_email
        FROM apartments a
        JOIN users u ON a.owner_id = u.id
        WHERE a.id = ?
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Check if apartment is active or if user is the owner
    if (!apartment.active && apartment.owner_id !== req.userId) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    res.json({
      ...apartment,
      images: apartment.images ? JSON.parse(apartment.images) : [],
      amenities: apartment.amenities ? JSON.parse(apartment.amenities) : [],
      landlord: {
        name: apartment.owner_name,
        image: apartment.owner_avatar,
        email: apartment.owner_email,
        rating: 4.5,
        responseRate: '95%',
        responseTime: 'within a few hours',
        memberSince: '2022'
      }
    });
  } catch (error) {
    console.error('Get apartment error:', error);
    res.status(500).json({ error: 'Failed to get apartment' });
  }
});

// Create apartment
router.post('/', authenticateToken, validateRequest(schemas.createApartment), async (req, res) => {
  try {
    const apartmentData = req.body;
    const apartmentId = uuidv4();

    // Convert arrays to JSON strings
    const amenities = JSON.stringify(apartmentData.amenities || []);
    const images = JSON.stringify(apartmentData.images || []);

    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO apartments (
          id, owner_id, title, description, location, price, beds, baths, sqft,
          available_date, property_type, furnished, amenities, images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        apartmentId, req.userId, apartmentData.title, apartmentData.description,
        apartmentData.location, apartmentData.price, apartmentData.beds,
        apartmentData.baths, apartmentData.sqft, apartmentData.available_date,
        apartmentData.property_type, apartmentData.furnished, amenities, images
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(201).json({
      message: 'Apartment created successfully',
      apartment_id: apartmentId
    });
  } catch (error) {
    console.error('Create apartment error:', error);
    res.status(500).json({ error: 'Failed to create apartment' });
  }
});

// Update apartment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user owns the apartment
    const apartment = await new Promise((resolve, reject) => {
      db.get('SELECT owner_id FROM apartments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (apartment.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this apartment' });
    }

    // Convert arrays to JSON strings
    if (updates.amenities) updates.amenities = JSON.stringify(updates.amenities);
    if (updates.images) updates.images = JSON.stringify(updates.images);

    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE apartments SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Apartment updated successfully' });
  } catch (error) {
    console.error('Update apartment error:', error);
    res.status(500).json({ error: 'Failed to update apartment' });
  }
});

// Delete apartment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the apartment
    const apartment = await new Promise((resolve, reject) => {
      db.get('SELECT owner_id FROM apartments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (apartment.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this apartment' });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM apartments WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    console.error('Delete apartment error:', error);
    res.status(500).json({ error: 'Failed to delete apartment' });
  }
});

// Get user's apartments
router.get('/user/my-listings', authenticateToken, async (req, res) => {
  try {
    const apartments = await new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM apartments 
        WHERE owner_id = ? 
        ORDER BY created_at DESC
      `, [req.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const processedApartments = apartments.map(apartment => ({
      ...apartment,
      images: apartment.images ? JSON.parse(apartment.images) : [],
      amenities: apartment.amenities ? JSON.parse(apartment.amenities) : []
    }));

    res.json(processedApartments);
  } catch (error) {
    console.error('Get user apartments error:', error);
    res.status(500).json({ error: 'Failed to get user apartments' });
  }
});

module.exports = router;