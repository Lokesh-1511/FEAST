/**
 * Emergency Supply Routes
 * Handles urgent supply requests and emergency coordination
 * Routes: POST /add, GET /, PUT /:id/respond, PUT /:id/fulfill
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { collections } = require('../config/firebaseAdmin');
const router = express.Router();

/**
 * POST /api/emergency/add
 * Post urgent supply request
 */
router.post('/add', async (req, res) => {
  try {
    const {
      vendorId,
      item,
      quantity,
      unit,
      maxPrice,
      urgencyLevel,
      neededBy,
      reason,
      message,
      location,
      contactInfo
    } = req.body;

    // Validation
    if (!vendorId || !item || !quantity || !urgencyLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Vendor ID, item, quantity, and urgency level are required'
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

    // Create emergency request
    const emergencyData = {
      id: uuidv4(),
      vendorId,
      vendorName: vendorData.name,
      vendorShop: vendorData.shopName,
      vendorContact: vendorData.phone,
      item: item.trim(),
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      urgencyLevel: urgencyLevel, // low, medium, high, critical
      neededBy: neededBy || null, // deadline timestamp
      reason: reason || '', // shortage, event, spoilage, etc.
      message: message || '',
      location: {
        address: location?.address || vendorData.location?.address || '',
        city: location?.city || vendorData.location?.city || '',
        state: location?.state || vendorData.location?.state || '',
        coordinates: location?.coordinates || vendorData.location?.coordinates || null
      },
      contactInfo: {
        phone: contactInfo?.phone || vendorData.phone,
        email: contactInfo?.email || vendorData.email,
        whatsapp: contactInfo?.whatsapp || vendorData.phone,
        preferredContact: contactInfo?.preferredContact || 'phone'
      },
      status: 'active', // active, partial, fulfilled, expired, cancelled
      priority: calculatePriority(urgencyLevel, neededBy),
      responses: [], // Array of vendor responses
      responseCount: 0,
      fulfilledBy: null,
      fulfilledAt: null,
      views: 0,
      broadcasts: 0, // Number of times broadcasted
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    // Auto-expire requests after certain time based on urgency
    const autoExpireHours = getAutoExpireHours(urgencyLevel);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + autoExpireHours);
    emergencyData.expiresAt = expiresAt.toISOString();

    // Save to Firestore
    await collections.emergency.doc(emergencyData.id).set(emergencyData);

    console.log(`🚨 Emergency request created: ${emergencyData.item} - ${emergencyData.quantity}${emergencyData.unit} by ${emergencyData.vendorName} (${emergencyData.urgencyLevel} priority)`);
    
    res.status(201).json({
      success: true,
      message: 'Emergency supply request created successfully',
      emergency: emergencyData,
      broadcastInfo: {
        priority: emergencyData.priority,
        expiresIn: `${autoExpireHours} hours`,
        estimatedReach: calculateEstimatedReach(emergencyData.location.city, urgencyLevel)
      }
    });

  } catch (error) {
    console.error('❌ Error creating emergency request:', error);
    res.status(500).json({
      error: 'Failed to create emergency request',
      message: 'Could not create emergency supply request. Please try again.'
    });
  }
});

/**
 * GET /api/emergency
 * Fetch all active emergency requests with filtering
 */
router.get('/', async (req, res) => {
  try {
    const { 
      item, 
      city, 
      urgencyLevel,
      status = 'active',
      vendorId,
      limit = 50,
      sortBy = 'priority',
      order = 'desc'
    } = req.query;

    let query = collections.emergency;

    // Apply filters
    if (item) {
      query = query.where('item', '>=', item.toLowerCase())
                   .where('item', '<=', item.toLowerCase() + '\uf8ff');
    }
    if (city) {
      query = query.where('location.city', '==', city);
    }
    if (urgencyLevel) {
      query = query.where('urgencyLevel', '==', urgencyLevel);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    if (vendorId) {
      query = query.where('vendorId', '==', vendorId);
    }

    // Apply sorting
    const sortOrder = order === 'desc' ? 'desc' : 'asc';
    if (sortBy === 'priority') {
      query = query.orderBy('priority', sortOrder).orderBy('createdAt', 'desc');
    } else {
      query = query.orderBy(sortBy, sortOrder);
    }

    // Apply limit
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const emergencyRequests = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Calculate time remaining
      if (data.neededBy) {
        const neededByTime = new Date(data.neededBy).getTime();
        const currentTime = new Date().getTime();
        const hoursRemaining = Math.max(0, (neededByTime - currentTime) / (1000 * 60 * 60));
        data.timeRemaining = {
          hours: Math.floor(hoursRemaining),
          days: Math.floor(hoursRemaining / 24),
          overdue: hoursRemaining <= 0
        };
      }

      // Calculate expiry time
      if (data.expiresAt) {
        const expiryTime = new Date(data.expiresAt).getTime();
        const currentTime = new Date().getTime();
        const hoursUntilExpiry = Math.max(0, (expiryTime - currentTime) / (1000 * 60 * 60));
        data.expiryInfo = {
          hours: Math.floor(hoursUntilExpiry),
          expired: hoursUntilExpiry <= 0
        };
      }
      
      emergencyRequests.push(data);
    });

    // Categorize by urgency
    const categorized = {
      critical: emergencyRequests.filter(req => req.urgencyLevel === 'critical'),
      high: emergencyRequests.filter(req => req.urgencyLevel === 'high'),
      medium: emergencyRequests.filter(req => req.urgencyLevel === 'medium'),
      low: emergencyRequests.filter(req => req.urgencyLevel === 'low')
    };

    res.json({
      success: true,
      count: emergencyRequests.length,
      emergencyRequests: emergencyRequests,
      categorized: categorized,
      summary: {
        critical: categorized.critical.length,
        high: categorized.high.length,
        medium: categorized.medium.length,
        low: categorized.low.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching emergency requests:', error);
    res.status(500).json({
      error: 'Fetch failed',
      message: 'Could not retrieve emergency requests'
    });
  }
});

/**
 * PUT /api/emergency/:id/respond
 * Respond to an emergency request
 */
router.put('/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      responderVendorId, 
      availableQuantity, 
      pricePerUnit, 
      availableBy, 
      message,
      canPartialFulfill 
    } = req.body;

    if (!responderVendorId || !availableQuantity) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Responder vendor ID and available quantity are required'
      });
    }

    // Check if emergency request exists and is active
    const emergencyDoc = await collections.emergency.doc(id).get();
    if (!emergencyDoc.exists) {
      return res.status(404).json({
        error: 'Emergency request not found'
      });
    }

    const emergencyData = emergencyDoc.data();
    if (emergencyData.status !== 'active') {
      return res.status(400).json({
        error: 'Request not active',
        message: 'This emergency request is no longer active'
      });
    }

    // Verify responder vendor exists
    const responderDoc = await collections.vendors.doc(responderVendorId).get();
    if (!responderDoc.exists) {
      return res.status(404).json({
        error: 'Responder vendor not found'
      });
    }

    const responderData = responderDoc.data();

    // Create response object
    const response = {
      id: uuidv4(),
      vendorId: responderVendorId,
      vendorName: responderData.name,
      vendorShop: responderData.shopName,
      vendorContact: responderData.phone,
      availableQuantity: parseFloat(availableQuantity),
      pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : null,
      availableBy: availableBy || null,
      message: message || '',
      canPartialFulfill: canPartialFulfill === true,
      status: 'pending', // pending, accepted, rejected
      respondedAt: new Date().toISOString()
    };

    // Add response to the emergency request
    const currentResponses = emergencyData.responses || [];
    currentResponses.push(response);

    await collections.emergency.doc(id).update({
      responses: currentResponses,
      responseCount: currentResponses.length,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Emergency response added: ${responderData.name} responded to ${emergencyData.item} request`);

    res.json({
      success: true,
      message: 'Response submitted successfully',
      response: response,
      contactInfo: {
        requester: {
          name: emergencyData.vendorName,
          contact: emergencyData.vendorContact,
          preferredContact: emergencyData.contactInfo?.preferredContact
        }
      }
    });

  } catch (error) {
    console.error('❌ Error responding to emergency:', error);
    res.status(500).json({
      error: 'Response failed',
      message: 'Could not submit response to emergency request'
    });
  }
});

/**
 * PUT /api/emergency/:id/fulfill
 * Mark emergency request as fulfilled
 */
router.put('/:id/fulfill', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      fulfilledByVendorId, 
      quantityFulfilled, 
      finalPrice, 
      responseId,
      isPartialFulfillment,
      notes 
    } = req.body;

    const emergencyDoc = await collections.emergency.doc(id).get();
    if (!emergencyDoc.exists) {
      return res.status(404).json({
        error: 'Emergency request not found'
      });
    }

    const emergencyData = emergencyDoc.data();

    // Verify the fulfillment request is from the original requester
    if (emergencyData.vendorId !== req.body.requesterVendorId) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Only the original requester can mark this as fulfilled'
      });
    }

    const updateData = {
      status: isPartialFulfillment ? 'partial' : 'fulfilled',
      fulfilledBy: {
        vendorId: fulfilledByVendorId,
        quantityFulfilled: parseFloat(quantityFulfilled),
        finalPrice: finalPrice ? parseFloat(finalPrice) : null,
        responseId: responseId
      },
      fulfilledAt: new Date().toISOString(),
      fulfillmentNotes: notes || '',
      updatedAt: new Date().toISOString()
    };

    await collections.emergency.doc(id).update(updateData);

    console.log(`✅ Emergency request fulfilled: ${id} - ${isPartialFulfillment ? 'Partially' : 'Fully'} fulfilled`);

    res.json({
      success: true,
      message: `Emergency request ${isPartialFulfillment ? 'partially' : 'fully'} fulfilled`,
      fulfillmentDetails: updateData.fulfilledBy
    });

  } catch (error) {
    console.error('❌ Error fulfilling emergency request:', error);
    res.status(500).json({
      error: 'Fulfillment failed',
      message: 'Could not mark emergency request as fulfilled'
    });
  }
});

/**
 * PUT /api/emergency/:id/cancel
 * Cancel emergency request
 */
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId, reason } = req.body;

    const emergencyDoc = await collections.emergency.doc(id).get();
    if (!emergencyDoc.exists) {
      return res.status(404).json({
        error: 'Emergency request not found'
      });
    }

    const emergencyData = emergencyDoc.data();
    
    // Verify the cancellation request is from the original requester
    if (emergencyData.vendorId !== vendorId) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Only the original requester can cancel this emergency request'
      });
    }

    await collections.emergency.doc(id).update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason || 'Cancelled by requester',
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Emergency request cancelled: ${id} - ${reason || 'No reason provided'}`);

    res.json({
      success: true,
      message: 'Emergency request cancelled successfully'
    });

  } catch (error) {
    console.error('❌ Error cancelling emergency request:', error);
    res.status(500).json({
      error: 'Cancellation failed',
      message: 'Could not cancel emergency request'
    });
  }
});

// Helper functions
function calculatePriority(urgencyLevel, neededBy) {
  let priority = 0;
  
  // Base priority from urgency level
  const urgencyScores = {
    'critical': 100,
    'high': 75,
    'medium': 50,
    'low': 25
  };
  priority += urgencyScores[urgencyLevel] || 25;
  
  // Add time-based urgency if deadline is provided
  if (neededBy) {
    const neededByTime = new Date(neededBy).getTime();
    const currentTime = new Date().getTime();
    const hoursRemaining = (neededByTime - currentTime) / (1000 * 60 * 60);
    
    if (hoursRemaining <= 6) priority += 50;
    else if (hoursRemaining <= 24) priority += 30;
    else if (hoursRemaining <= 72) priority += 10;
  }
  
  return Math.min(priority, 150); // Cap at 150
}

function getAutoExpireHours(urgencyLevel) {
  const expireHours = {
    'critical': 12,
    'high': 24,
    'medium': 72,
    'low': 168 // 1 week
  };
  return expireHours[urgencyLevel] || 72;
}

function calculateEstimatedReach(city, urgencyLevel) {
  // Simulate estimated reach based on city and urgency
  const baseReach = city ? 50 : 20; // More vendors in known cities
  const urgencyMultiplier = {
    'critical': 3,
    'high': 2,
    'medium': 1.5,
    'low': 1
  };
  
  return Math.floor(baseReach * (urgencyMultiplier[urgencyLevel] || 1));
}

module.exports = router;
