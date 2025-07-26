/**
 * Price Routes
 * Handles crowd-verified mandi prices with proof photo uploads
 * Routes: POST /add, GET /, PUT /:id/verify
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { collections } = require('../config/firebaseAdmin');
const { simulateOCR } = require('../utils/ocr');
const router = express.Router();

/**
 * POST /api/prices/add
 * Add crowd-verified mandi prices with proof photo
 */
router.post('/add', async (req, res) => {
  try {
    const {
      vendorId,
      item,
      price,
      unit,
      marketName,
      proofPhotoURL,
      location,
      notes
    } = req.body;

    // Validation
    if (!vendorId || !item || !price || !proofPhotoURL) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Vendor ID, item, price, and proof photo are required'
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

    // Simulate OCR validation on proof photo
    const ocrResult = await simulateOCR(proofPhotoURL, item, price);

    // Create price entry
    const priceData = {
      id: uuidv4(),
      vendorId,
      vendorName: vendorDoc.data().name,
      item: item.trim().toLowerCase(),
      price: parseFloat(price),
      unit: unit || 'kg',
      marketName: marketName || 'Local Market',
      proofPhotoURL,
      location: {
        address: location?.address || '',
        city: location?.city || '',
        state: location?.state || '',
        coordinates: location?.coordinates || null
      },
      notes: notes || '',
      ocrValidation: ocrResult,
      verified: ocrResult.confidence > 0.7, // Auto-verify if OCR confidence is high
      verificationStatus: ocrResult.confidence > 0.7 ? 'verified' : 'pending',
      upvotes: 0,
      downvotes: 0,
      reportCount: 0,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Save to Firestore
    await collections.prices.doc(priceData.id).set(priceData);

    console.log(`✅ New price entry added: ${priceData.item} - ₹${priceData.price}/${priceData.unit} by ${priceData.vendorName}`);
    
    res.status(201).json({
      success: true,
      message: 'Price entry added successfully',
      price: priceData,
      ocrValidation: ocrResult
    });

  } catch (error) {
    console.error('❌ Error adding price entry:', error);
    res.status(500).json({
      error: 'Failed to add price',
      message: 'Could not add price entry. Please try again.'
    });
  }
});

/**
 * GET /api/prices
 * Fetch all price entries with filtering options
 */
router.get('/', async (req, res) => {
  try {
    const { 
      item, 
      city, 
      vendorId, 
      verified, 
      limit = 100,
      sortBy = 'timestamp',
      order = 'desc'
    } = req.query;

    let query = collections.prices;

    // Apply filters
    if (item) {
      query = query.where('item', '==', item.toLowerCase());
    }
    if (city) {
      query = query.where('location.city', '==', city);
    }
    if (vendorId) {
      query = query.where('vendorId', '==', vendorId);
    }
    if (verified !== undefined) {
      query = query.where('verified', '==', verified === 'true');
    }

    // Apply sorting
    const sortOrder = order === 'desc' ? 'desc' : 'asc';
    query = query.orderBy(sortBy, sortOrder);

    // Apply limit
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const prices = [];

    snapshot.forEach(doc => {
      prices.push(doc.data());
    });

    // Group prices by item for easy analysis
    const pricesByItem = {};
    prices.forEach(price => {
      if (!pricesByItem[price.item]) {
        pricesByItem[price.item] = [];
      }
      pricesByItem[price.item].push(price);
    });

    res.json({
      success: true,
      count: prices.length,
      prices: prices,
      pricesByItem: pricesByItem,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching prices:', error);
    res.status(500).json({
      error: 'Fetch failed',
      message: 'Could not retrieve price information'
    });
  }
});

/**
 * GET /api/prices/trends/:item
 * Get price trends for a specific item
 */
router.get('/trends/:item', async (req, res) => {
  try {
    const { item } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const snapshot = await collections.prices
      .where('item', '==', item.toLowerCase())
      .where('verified', '==', true)
      .where('timestamp', '>=', startDate.toISOString())
      .orderBy('timestamp', 'asc')
      .get();

    const prices = [];
    snapshot.forEach(doc => {
      prices.push(doc.data());
    });

    // Calculate trends
    const avgPrice = prices.length > 0 
      ? prices.reduce((sum, p) => sum + p.price, 0) / prices.length 
      : 0;
    
    const minPrice = prices.length > 0 
      ? Math.min(...prices.map(p => p.price)) 
      : 0;
    
    const maxPrice = prices.length > 0 
      ? Math.max(...prices.map(p => p.price)) 
      : 0;

    res.json({
      success: true,
      item: item,
      period: `${days} days`,
      count: prices.length,
      averagePrice: avgPrice,
      minPrice: minPrice,
      maxPrice: maxPrice,
      prices: prices,
      trends: {
        isIncreasing: prices.length > 1 ? prices[prices.length - 1].price > prices[0].price : false,
        percentChange: prices.length > 1 
          ? ((prices[prices.length - 1].price - prices[0].price) / prices[0].price * 100).toFixed(2)
          : 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching price trends:', error);
    res.status(500).json({
      error: 'Trends fetch failed',
      message: 'Could not retrieve price trends'
    });
  }
});

/**
 * PUT /api/prices/:id/verify
 * Verify or reject a price entry
 */
router.put('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, reason } = req.body;

    const priceDoc = await collections.prices.doc(id).get();
    if (!priceDoc.exists) {
      return res.status(404).json({
        error: 'Price entry not found',
        message: `No price entry found with ID: ${id}`
      });
    }

    await collections.prices.doc(id).update({
      verified: verified === true,
      verificationStatus: verified ? 'verified' : 'rejected',
      verificationReason: reason || '',
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Price verification updated: ${id} - ${verified ? 'Verified' : 'Rejected'}`);

    res.json({
      success: true,
      message: `Price entry ${verified ? 'verified' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('❌ Error verifying price:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Could not update price verification status'
    });
  }
});

/**
 * POST /api/prices/:id/vote
 * Upvote or downvote a price entry
 */
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { vote, vendorId } = req.body; // vote: 'up' or 'down'

    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({
        error: 'Invalid vote',
        message: 'Vote must be either "up" or "down"'
      });
    }

    const priceDoc = await collections.prices.doc(id).get();
    if (!priceDoc.exists) {
      return res.status(404).json({
        error: 'Price entry not found'
      });
    }

    const currentData = priceDoc.data();
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (vote === 'up') {
      updateData.upvotes = (currentData.upvotes || 0) + 1;
    } else {
      updateData.downvotes = (currentData.downvotes || 0) + 1;
    }

    await collections.prices.doc(id).update(updateData);

    res.json({
      success: true,
      message: `Price entry ${vote}voted successfully`,
      votes: {
        upvotes: updateData.upvotes || currentData.upvotes || 0,
        downvotes: updateData.downvotes || currentData.downvotes || 0
      }
    });

  } catch (error) {
    console.error('❌ Error voting on price:', error);
    res.status(500).json({
      error: 'Vote failed',
      message: 'Could not register vote'
    });
  }
});

module.exports = router;
