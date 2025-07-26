/**
 * Vendor Routes
 * Handles vendor registration, profile management, and verification
 * Routes: POST /register, GET /:id, PUT /:id, GET /
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { collections } = require('../config/firebaseAdmin');
const router = express.Router();

/**
 * POST /api/vendors/register
 * Register a new vendor with their shop details
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      shopName,
      location,
      timings,
      rawMaterials,
      shopPhotoURL,
      phone,
      email
    } = req.body;

    // Validation
    if (!name || !shopName || !location) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, shop name, and location are required'
      });
    }

    // Create vendor object
    const vendorData = {
      id: uuidv4(),
      name: name.trim(),
      shopName: shopName.trim(),
      location: {
        address: location.address || '',
        city: location.city || '',
        state: location.state || '',
        pincode: location.pincode || '',
        coordinates: location.coordinates || null
      },
      timings: {
        openTime: timings?.openTime || '09:00',
        closeTime: timings?.closeTime || '18:00',
        daysOpen: timings?.daysOpen || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      rawMaterials: rawMaterials || [],
      shopPhotoURL: shopPhotoURL || '',
      phone: phone || '',
      email: email || '',
      verified: false, // Will be verified through VPT process
      vptStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      totalOrders: 0,
      isActive: true
    };

    // Save to Firestore
    await collections.vendors.doc(vendorData.id).set(vendorData);

    console.log(`✅ New vendor registered: ${vendorData.name} (${vendorData.id})`);
    
    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully',
      vendor: vendorData
    });

  } catch (error) {
    console.error('❌ Error registering vendor:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Could not register vendor. Please try again.'
    });
  }
});

/**
 * GET /api/vendors/:id
 * Get vendor profile by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vendorDoc = await collections.vendors.doc(id).get();

    if (!vendorDoc.exists) {
      return res.status(404).json({
        error: 'Vendor not found',
        message: `No vendor found with ID: ${id}`
      });
    }

    const vendorData = vendorDoc.data();
    
    res.json({
      success: true,
      vendor: vendorData
    });

  } catch (error) {
    console.error('❌ Error fetching vendor:', error);
    res.status(500).json({
      error: 'Fetch failed',
      message: 'Could not retrieve vendor information'
    });
  }
});

/**
 * PUT /api/vendors/:id
 * Update vendor details
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if vendor exists
    const vendorDoc = await collections.vendors.doc(id).get();
    if (!vendorDoc.exists) {
      return res.status(404).json({
        error: 'Vendor not found',
        message: `No vendor found with ID: ${id}`
      });
    }

    // Prepare update object (exclude sensitive fields)
    const allowedUpdates = [
      'name', 'shopName', 'location', 'timings', 'rawMaterials',
      'shopPhotoURL', 'phone', 'email'
    ];
    
    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdates[field] = updateData[field];
      }
    });

    // Add timestamp
    filteredUpdates.updatedAt = new Date().toISOString();

    // Update in Firestore
    await collections.vendors.doc(id).update(filteredUpdates);

    // Get updated vendor data
    const updatedVendor = await collections.vendors.doc(id).get();
    
    console.log(`✅ Vendor updated: ${id}`);
    
    res.json({
      success: true,
      message: 'Vendor updated successfully',
      vendor: updatedVendor.data()
    });

  } catch (error) {
    console.error('❌ Error updating vendor:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'Could not update vendor information'
    });
  }
});

/**
 * GET /api/vendors
 * Fetch all vendors with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { city, verified, active, limit = 50 } = req.query;

    let query = collections.vendors;

    // Apply filters
    if (city) {
      query = query.where('location.city', '==', city);
    }
    if (verified !== undefined) {
      query = query.where('verified', '==', verified === 'true');
    }
    if (active !== undefined) {
      query = query.where('isActive', '==', active === 'true');
    }

    // Apply limit
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const vendors = [];

    snapshot.forEach(doc => {
      vendors.push(doc.data());
    });

    res.json({
      success: true,
      count: vendors.length,
      vendors: vendors
    });

  } catch (error) {
    console.error('❌ Error fetching vendors:', error);
    res.status(500).json({
      error: 'Fetch failed',
      message: 'Could not retrieve vendors list'
    });
  }
});

/**
 * POST /api/vendors/:id/verify
 * Verify a vendor (admin functionality)
 */
router.post('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, vptStatus } = req.body;

    await collections.vendors.doc(id).update({
      verified: verified === true,
      vptStatus: vptStatus || 'verified',
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Vendor verification updated: ${id} - ${verified ? 'Verified' : 'Unverified'}`);

    res.json({
      success: true,
      message: `Vendor ${verified ? 'verified' : 'unverified'} successfully`
    });

  } catch (error) {
    console.error('❌ Error verifying vendor:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Could not update vendor verification status'
    });
  }
});

module.exports = router;
