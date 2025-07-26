/**
 * Surplus Stock Routes
 * Handles surplus stock exchange between vendors
 * Routes: POST /add, GET /, PUT /:id/claim, DELETE /:id
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { collections } = require('../config/firebaseAdmin');
const router = express.Router();

/**
 * POST /api/surplus/add
 * Add surplus stock for exchange
 */
router.post('/add', async (req, res) => {
  try {
    const {
      vendorId,
      item,
      quantity,
      unit,
      originalPrice,
      discountedPrice,
      expiryDate,
      condition,
      description,
      photoURL,
      location
    } = req.body;

    // Validation
    if (!vendorId || !item || !quantity || !originalPrice) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Vendor ID, item, quantity, and original price are required'
      });
    }

    // Verify vendor exists
    const vendorDoc = await collections.vendors.doc(vendorId).get();
    if (!vendorDoc.exists) {
      return res.status(404).json({
        error: 'Vendor not found',
        message: 'Invalid vendor ID provided'
      });
    }

    const vendorData = vendorDoc.data();

    // Create surplus entry
    const surplusData = {
      id: uuidv4(),
      vendorId,
      vendorName: vendorData.name,
      vendorShop: vendorData.shopName,
      vendorContact: vendorData.phone,
      item: item.trim(),
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      originalPrice: parseFloat(originalPrice),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : parseFloat(originalPrice) * 0.8,
      savings: parseFloat(originalPrice) - (discountedPrice ? parseFloat(discountedPrice) : parseFloat(originalPrice) * 0.8),
      expiryDate: expiryDate || null,
      condition: condition || 'good', // good, fair, needs_quick_sale
      description: description || '',
      photoURL: photoURL || '',
      location: {
        address: location?.address || vendorData.location?.address || '',
        city: location?.city || vendorData.location?.city || '',
        state: location?.state || vendorData.location?.state || '',
        coordinates: location?.coordinates || vendorData.location?.coordinates || null
      },
      status: 'available', // available, claimed, completed, expired
      claimedBy: null,
      claimedAt: null,
      views: 0,
      interested: [],
      priority: condition === 'needs_quick_sale' ? 'high' : 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    // Calculate urgency score based on expiry date
    if (surplusData.expiryDate) {
      const expiryTime = new Date(surplusData.expiryDate).getTime();
      const currentTime = new Date().getTime();
      const hoursUntilExpiry = (expiryTime - currentTime) / (1000 * 60 * 60);
      
      if (hoursUntilExpiry <= 24) {
        surplusData.priority = 'urgent';
        surplusData.condition = 'needs_quick_sale';
      } else if (hoursUntilExpiry <= 72) {
        surplusData.priority = 'high';
      }
    }

    // Save to Firestore
    await collections.surplus.doc(surplusData.id).set(surplusData);

    console.log(`✅ New surplus stock added: ${surplusData.item} - ${surplusData.quantity}${surplusData.unit} by ${surplusData.vendorName}`);
    
    res.status(201).json({
      success: true,
      message: 'Surplus stock added successfully',
      surplus: surplusData
    });

  } catch (error) {
    console.error('❌ Error adding surplus stock:', error);
    res.status(500).json({
      error: 'Failed to add surplus',
      message: 'Could not add surplus stock. Please try again.'
    });
  }
});

/**
 * GET /api/surplus
 * Fetch all available surplus stock with filtering
 */
router.get('/', async (req, res) => {
  try {
    const { 
      item, 
      city, 
      vendorId, 
      status = 'available',
      priority,
      condition,
      limit = 50,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    let query = collections.surplus;

    // Apply filters
    if (item) {
      query = query.where('item', '>=', item.toLowerCase())
                   .where('item', '<=', item.toLowerCase() + '\uf8ff');
    }
    if (city) {
      query = query.where('location.city', '==', city);
    }
    if (vendorId) {
      query = query.where('vendorId', '==', vendorId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    if (priority) {
      query = query.where('priority', '==', priority);
    }
    if (condition) {
      query = query.where('condition', '==', condition);
    }

    // Apply sorting
    const sortOrder = order === 'desc' ? 'desc' : 'asc';
    query = query.orderBy(sortBy, sortOrder);

    // Apply limit
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const surplusItems = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Calculate time remaining if expiry date exists
      if (data.expiryDate) {
        const expiryTime = new Date(data.expiryDate).getTime();
        const currentTime = new Date().getTime();
        const hoursRemaining = Math.max(0, (expiryTime - currentTime) / (1000 * 60 * 60));
        data.timeRemaining = {
          hours: Math.floor(hoursRemaining),
          days: Math.floor(hoursRemaining / 24),
          expired: hoursRemaining <= 0
        };
      }
      
      surplusItems.push(data);
    });

    // Separate by priority for better organization
    const categorized = {
      urgent: surplusItems.filter(item => item.priority === 'urgent'),
      high: surplusItems.filter(item => item.priority === 'high'),
      normal: surplusItems.filter(item => item.priority === 'normal')
    };

    res.json({
      success: true,
      count: surplusItems.length,
      surplus: surplusItems,
      categorized: categorized,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching surplus stock:', error);
    res.status(500).json({
      error: 'Fetch failed',
      message: 'Could not retrieve surplus stock information'
    });
  }
});

/**
 * PUT /api/surplus/:id/claim
 * Claim surplus stock
 */
router.put('/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const { claimedByVendorId, message, expectedPickupTime } = req.body;

    if (!claimedByVendorId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Claimer vendor ID is required'
      });
    }

    // Check if surplus exists and is available
    const surplusDoc = await collections.surplus.doc(id).get();
    if (!surplusDoc.exists) {
      return res.status(404).json({
        error: 'Surplus not found',
        message: `No surplus found with ID: ${id}`
      });
    }

    const surplusData = surplusDoc.data();
    if (surplusData.status !== 'available') {
      return res.status(400).json({
        error: 'Surplus not available',
        message: 'This surplus stock has already been claimed or is no longer available'
      });
    }

    // Verify claimer vendor exists
    const claimerDoc = await collections.vendors.doc(claimedByVendorId).get();
    if (!claimerDoc.exists) {
      return res.status(404).json({
        error: 'Claimer vendor not found',
        message: 'Invalid claimer vendor ID'
      });
    }

    const claimerData = claimerDoc.data();

    // Update surplus status
    const updateData = {
      status: 'claimed',
      claimedBy: {
        vendorId: claimedByVendorId,
        vendorName: claimerData.name,
        vendorShop: claimerData.shopName,
        vendorContact: claimerData.phone
      },
      claimedAt: new Date().toISOString(),
      claimMessage: message || '',
      expectedPickupTime: expectedPickupTime || null,
      updatedAt: new Date().toISOString()
    };

    await collections.surplus.doc(id).update(updateData);

    console.log(`✅ Surplus claimed: ${surplusData.item} claimed by ${claimerData.name}`);

    res.json({
      success: true,
      message: 'Surplus stock claimed successfully',
      claimedBy: updateData.claimedBy,
      contactInfo: {
        originalVendor: {
          name: surplusData.vendorName,
          contact: surplusData.vendorContact
        },
        claimer: {
          name: claimerData.name,
          contact: claimerData.phone
        }
      }
    });

  } catch (error) {
    console.error('❌ Error claiming surplus:', error);
    res.status(500).json({
      error: 'Claim failed',
      message: 'Could not claim surplus stock'
    });
  }
});

/**
 * PUT /api/surplus/:id/complete
 * Mark surplus exchange as completed
 */
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { completedByVendorId, rating, feedback } = req.body;

    const surplusDoc = await collections.surplus.doc(id).get();
    if (!surplusDoc.exists) {
      return res.status(404).json({
        error: 'Surplus not found'
      });
    }

    const surplusData = surplusDoc.data();
    
    // Verify the request is from either the original vendor or claimer
    if (surplusData.vendorId !== completedByVendorId && 
        surplusData.claimedBy?.vendorId !== completedByVendorId) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Only the original vendor or claimer can mark this as completed'
      });
    }

    await collections.surplus.doc(id).update({
      status: 'completed',
      completedAt: new Date().toISOString(),
      completedBy: completedByVendorId,
      rating: rating || null,
      feedback: feedback || '',
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Surplus exchange completed: ${id}`);

    res.json({
      success: true,
      message: 'Surplus exchange marked as completed'
    });

  } catch (error) {
    console.error('❌ Error completing surplus exchange:', error);
    res.status(500).json({
      error: 'Completion failed',
      message: 'Could not mark exchange as completed'
    });
  }
});

/**
 * DELETE /api/surplus/:id
 * Remove surplus stock (only by original vendor)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId, reason } = req.body;

    const surplusDoc = await collections.surplus.doc(id).get();
    if (!surplusDoc.exists) {
      return res.status(404).json({
        error: 'Surplus not found'
      });
    }

    const surplusData = surplusDoc.data();
    
    // Verify the request is from the original vendor
    if (surplusData.vendorId !== vendorId) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Only the original vendor can remove this surplus stock'
      });
    }

    // Instead of deleting, mark as inactive for audit trail
    await collections.surplus.doc(id).update({
      isActive: false,
      status: 'removed',
      removedAt: new Date().toISOString(),
      removalReason: reason || 'Removed by vendor',
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Surplus removed: ${id} - ${reason || 'No reason provided'}`);

    res.json({
      success: true,
      message: 'Surplus stock removed successfully'
    });

  } catch (error) {
    console.error('❌ Error removing surplus:', error);
    res.status(500).json({
      error: 'Removal failed',
      message: 'Could not remove surplus stock'
    });
  }
});

module.exports = router;
