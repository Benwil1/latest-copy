const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Apartment, User } = require('../models');
const { validateRequest, schemas } = require('../middleware/validation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all apartments (with optional filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      location,
      min_price,
      max_price,
      bedrooms,
      bathrooms,
      furnished,
      amenities,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (location) {
      filter.$or = [
        { address: new RegExp(location, 'i') },
        { city: new RegExp(location, 'i') },
        { country: new RegExp(location, 'i') }
      ];
    }

    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = parseInt(min_price);
      if (max_price) filter.price.$lte = parseInt(max_price);
    }

    if (bedrooms) {
      filter.bedrooms = { $gte: parseInt(bedrooms) };
    }

    if (bathrooms) {
      filter.bathrooms = { $gte: parseInt(bathrooms) };
    }

    if (furnished !== undefined) {
      filter.furnished = furnished === 'true';
    }

    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $in: amenityList };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const apartments = await Apartment.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('owner_id', 'name profile_picture email');

    // Format response
    const processedApartments = apartments.map(apartment => ({
      id: apartment._id,
      title: apartment.title,
      description: apartment.description,
      address: apartment.address,
      city: apartment.city,
      country: apartment.country,
      price: apartment.price,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      area: apartment.area,
      furnished: apartment.furnished,
      amenities: apartment.amenities,
      images: apartment.images,
      available_from: apartment.available_from,
      lease_duration: apartment.lease_duration,
      deposit: apartment.deposit,
      utilities_included: apartment.utilities_included,
      pet_friendly: apartment.pet_friendly,
      smoking_allowed: apartment.smoking_allowed,
      status: apartment.status,
      created_at: apartment.created_at,
      landlord: {
        name: apartment.owner_id?.name,
        image: apartment.owner_id?.profile_picture,
        rating: 4.5, // Mock rating - implement proper rating system
        response_rate: '95%',
        response_time: 'within a few hours',
        member_since: '2022'
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

    const apartment = await Apartment.findById(id).populate('owner_id', 'name profile_picture email');

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Check if apartment is active or if user is the owner
    if (apartment.status !== 'active' && apartment.owner_id._id.toString() !== req.userId) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    res.json({
      id: apartment._id,
      title: apartment.title,
      description: apartment.description,
      address: apartment.address,
      city: apartment.city,
      country: apartment.country,
      price: apartment.price,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      area: apartment.area,
      furnished: apartment.furnished,
      amenities: apartment.amenities,
      images: apartment.images,
      available_from: apartment.available_from,
      lease_duration: apartment.lease_duration,
      deposit: apartment.deposit,
      utilities_included: apartment.utilities_included,
      pet_friendly: apartment.pet_friendly,
      smoking_allowed: apartment.smoking_allowed,
      status: apartment.status,
      created_at: apartment.created_at,
      updated_at: apartment.updated_at,
      landlord: {
        name: apartment.owner_id?.name,
        image: apartment.owner_id?.profile_picture,
        email: apartment.owner_id?.email,
        rating: 4.5,
        response_rate: '95%',
        response_time: 'within a few hours',
        member_since: '2022'
      }
    });
  } catch (error) {
    console.error('Get apartment error:', error);
    res.status(500).json({ error: 'Failed to get apartment' });
  }
});

// Create apartment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const apartmentData = req.body;
    const apartmentId = uuidv4();

    const newApartment = new Apartment({
      _id: apartmentId,
      owner_id: req.userId,
      title: apartmentData.title,
      description: apartmentData.description,
      address: apartmentData.address,
      city: apartmentData.city,
      country: apartmentData.country,
      price: apartmentData.price,
      bedrooms: apartmentData.bedrooms,
      bathrooms: apartmentData.bathrooms,
      area: apartmentData.area,
      furnished: apartmentData.furnished || false,
      amenities: apartmentData.amenities || [],
      images: apartmentData.images || [],
      available_from: apartmentData.available_from,
      lease_duration: apartmentData.lease_duration,
      deposit: apartmentData.deposit,
      utilities_included: apartmentData.utilities_included || false,
      pet_friendly: apartmentData.pet_friendly || false,
      smoking_allowed: apartmentData.smoking_allowed || false
    });

    await newApartment.save();

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
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (apartment.owner_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this apartment' });
    }

    // Update the apartment
    updates.updated_at = new Date();
    await Apartment.findByIdAndUpdate(id, updates);

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
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (apartment.owner_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this apartment' });
    }

    await Apartment.findByIdAndDelete(id);

    res.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    console.error('Delete apartment error:', error);
    res.status(500).json({ error: 'Failed to delete apartment' });
  }
});

// Get user's apartments
router.get('/user/my-listings', authenticateToken, async (req, res) => {
  try {
    const apartments = await Apartment.find({ owner_id: req.userId })
      .sort({ created_at: -1 });

    const processedApartments = apartments.map(apartment => ({
      id: apartment._id,
      title: apartment.title,
      description: apartment.description,
      address: apartment.address,
      city: apartment.city,
      country: apartment.country,
      price: apartment.price,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      area: apartment.area,
      furnished: apartment.furnished,
      amenities: apartment.amenities,
      images: apartment.images,
      available_from: apartment.available_from,
      lease_duration: apartment.lease_duration,
      deposit: apartment.deposit,
      utilities_included: apartment.utilities_included,
      pet_friendly: apartment.pet_friendly,
      smoking_allowed: apartment.smoking_allowed,
      status: apartment.status,
      created_at: apartment.created_at,
      updated_at: apartment.updated_at
    }));

    res.json(processedApartments);
  } catch (error) {
    console.error('Get user apartments error:', error);
    res.status(500).json({ error: 'Failed to get user apartments' });
  }
});

module.exports = router;