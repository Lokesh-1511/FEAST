/**
 * OCR Utility
 * Dummy OCR simulation for proof photo validation
 * In production, this would integrate with actual OCR services like Google Vision, AWS Textract, etc.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Simulate OCR text extraction from proof photos
 * @param {string} imageUrl - URL of the proof photo
 * @param {string} expectedItem - Expected item name to validate
 * @param {number} expectedPrice - Expected price to validate
 * @returns {Object} OCR result with extracted text and validation
 */
async function simulateOCR(imageUrl, expectedItem, expectedPrice) {
  try {
    console.log(`🔍 Simulating OCR for image: ${imageUrl}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate dummy OCR results
    const ocrResult = generateDummyOCRResult(expectedItem, expectedPrice);
    
    console.log(`✅ OCR simulation completed - Confidence: ${ocrResult.confidence}%`);
    
    return ocrResult;

  } catch (error) {
    console.error('❌ OCR simulation error:', error);
    return {
      success: false,
      confidence: 0,
      extractedText: '',
      validationResult: {
        itemMatch: false,
        priceMatch: false,
        overall: false
      },
      error: 'OCR processing failed'
    };
  }
}

/**
 * Generate dummy OCR results that simulate real OCR behavior
 * @param {string} expectedItem - Item name to simulate finding
 * @param {number} expectedPrice - Price to simulate finding
 * @returns {Object} Simulated OCR result
 */
function generateDummyOCRResult(expectedItem, expectedPrice) {
  // Simulate OCR accuracy (70-95% confidence range)
  const baseConfidence = 0.7 + Math.random() * 0.25;
  
  // Simulate extracted text with some OCR errors
  const extractedText = generateDummyExtractedText(expectedItem, expectedPrice, baseConfidence);
  
  // Validate extracted content against expected values
  const validation = validateOCRContent(extractedText, expectedItem, expectedPrice);
  
  // Adjust confidence based on validation results
  let finalConfidence = baseConfidence;
  if (validation.itemMatch && validation.priceMatch) {
    finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
  } else if (validation.itemMatch || validation.priceMatch) {
    finalConfidence = Math.min(finalConfidence, 0.8);
  } else {
    finalConfidence = Math.min(finalConfidence, 0.6);
  }

  return {
    success: true,
    confidence: Math.round(finalConfidence * 100) / 100,
    extractedText: extractedText,
    processedText: {
      cleanedText: extractedText.replace(/[^\w\s₹.,-]/g, ''),
      detectedItems: extractDetectedItems(extractedText),
      detectedPrices: extractDetectedPrices(extractedText),
      detectedDates: extractDetectedDates(extractedText)
    },
    validationResult: {
      itemMatch: validation.itemMatch,
      priceMatch: validation.priceMatch,
      overall: validation.itemMatch && validation.priceMatch,
      matchScore: (validation.itemMatch ? 0.5 : 0) + (validation.priceMatch ? 0.5 : 0)
    },
    metadata: {
      processingTime: `${(1000 + Math.random() * 2000).toFixed(0)}ms`,
      imageQuality: Math.random() > 0.3 ? 'good' : 'fair',
      textOrientation: 'horizontal',
      language: 'en',
      ocrEngine: 'FEAST_OCR_SIMULATOR_v1.0'
    },
    suggestedCorrections: generateSuggestedCorrections(validation, expectedItem, expectedPrice)
  };
}

/**
 * Generate realistic dummy extracted text with OCR-like errors
 */
function generateDummyExtractedText(expectedItem, expectedPrice, confidence) {
  const templates = [
    // Mandi receipt template
    `MANDI PRICE LIST
Date: ${new Date().toLocaleDateString()}
${addOCRNoise(expectedItem, confidence)}: ₹${addPriceNoise(expectedPrice, confidence)}/kg
Quality: Grade A
Market: Local Mandi
Verified by: Inspector`,
    
    // Wholesale price template
    `WHOLESALE RATES
${addOCRNoise(expectedItem, confidence)} - ₹${addPriceNoise(expectedPrice, confidence)}
Fresh Stock Available
Contact: 9876543210`,
    
    // Market board template
    `TODAY'S RATES
${addOCRNoise(expectedItem, confidence)}: ${addPriceNoise(expectedPrice, confidence)} per kg
Supply: Good
Demand: Moderate`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Add realistic OCR noise to item names
 */
function addOCRNoise(item, confidence) {
  if (confidence > 0.9) return item;
  
  let noisyItem = item;
  
  // Common OCR mistakes
  const ocrMistakes = {
    'o': '0',
    '0': 'o',
    'i': 'l',
    'l': 'i',
    'rn': 'm',
    'cl': 'd'
  };
  
  if (confidence < 0.8) {
    // Introduce some character mistakes
    for (const [original, mistake] of Object.entries(ocrMistakes)) {
      if (Math.random() < 0.3) {
        noisyItem = noisyItem.replace(original, mistake);
      }
    }
  }
  
  return noisyItem;
}

/**
 * Add realistic OCR noise to prices
 */
function addPriceNoise(price, confidence) {
  if (confidence > 0.9) return price;
  
  let noisyPrice = price;
  
  if (confidence < 0.8 && Math.random() < 0.2) {
    // Occasionally misread digits
    noisyPrice = price * (0.9 + Math.random() * 0.2); // ±10% variation
  }
  
  return Math.round(noisyPrice * 100) / 100;
}

/**
 * Validate OCR content against expected values
 */
function validateOCRContent(extractedText, expectedItem, expectedPrice) {
  const text = extractedText.toLowerCase();
  const itemWords = expectedItem.toLowerCase().split(' ');
  
  // Check item match (fuzzy matching)
  const itemMatch = itemWords.some(word => {
    if (word.length < 3) return false;
    return text.includes(word) || text.includes(word.slice(0, -1)) || text.includes(word + 's');
  });
  
  // Check price match (within 20% tolerance)
  const priceNumbers = extractedText.match(/₹?(\d+\.?\d*)/g) || [];
  const extractedPrices = priceNumbers.map(p => parseFloat(p.replace('₹', '')));
  const priceMatch = extractedPrices.some(price => {
    const difference = Math.abs(price - expectedPrice) / expectedPrice;
    return difference <= 0.2; // 20% tolerance
  });
  
  return { itemMatch, priceMatch };
}

/**
 * Extract detected items from OCR text
 */
function extractDetectedItems(text) {
  const commonItems = [
    'rice', 'wheat', 'tomato', 'onion', 'potato', 'milk', 'egg',
    'oil', 'sugar', 'dal', 'vegetables', 'fruits', 'grains'
  ];
  
  const detectedItems = [];
  const textLower = text.toLowerCase();
  
  commonItems.forEach(item => {
    if (textLower.includes(item)) {
      detectedItems.push(item);
    }
  });
  
  return detectedItems;
}

/**
 * Extract detected prices from OCR text
 */
function extractDetectedPrices(text) {
  const priceRegex = /₹?(\d+\.?\d*)/g;
  const matches = text.match(priceRegex) || [];
  
  return matches.map(price => ({
    raw: price,
    value: parseFloat(price.replace('₹', '')),
    currency: '₹'
  }));
}

/**
 * Extract detected dates from OCR text
 */
function extractDetectedDates(text) {
  const dateRegex = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g;
  const matches = text.match(dateRegex) || [];
  
  return matches.map(date => ({
    raw: date,
    parsed: new Date(date).toISOString().split('T')[0]
  }));
}

/**
 * Generate suggested corrections based on validation results
 */
function generateSuggestedCorrections(validation, expectedItem, expectedPrice) {
  const suggestions = [];
  
  if (!validation.itemMatch) {
    suggestions.push({
      type: 'item_mismatch',
      message: `Expected item "${expectedItem}" not clearly detected in image`,
      suggestion: 'Ensure item name is clearly visible and well-lit in the photo'
    });
  }
  
  if (!validation.priceMatch) {
    suggestions.push({
      type: 'price_mismatch',
      message: `Expected price ₹${expectedPrice} not found or unclear`,
      suggestion: 'Make sure price is clearly visible without obstructions'
    });
  }
  
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'success',
      message: 'OCR validation successful',
      suggestion: 'All expected information was detected correctly'
    });
  }
  
  return suggestions;
}

/**
 * Batch OCR processing for multiple images
 * @param {Array} imageUrls - Array of image URLs to process
 * @param {Object} validationData - Expected data for validation
 * @returns {Array} Array of OCR results
 */
async function batchOCR(imageUrls, validationData = {}) {
  console.log(`🔍 Processing batch OCR for ${imageUrls.length} images`);
  
  const results = [];
  
  for (const imageUrl of imageUrls) {
    const result = await simulateOCR(
      imageUrl,
      validationData.item || 'unknown',
      validationData.price || 0
    );
    
    results.push({
      imageUrl,
      result,
      processedAt: new Date().toISOString()
    });
    
    // Add small delay between processing
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✅ Batch OCR completed: ${results.length} images processed`);
  
  return {
    success: true,
    totalProcessed: results.length,
    results: results,
    summary: {
      highConfidence: results.filter(r => r.result.confidence > 0.8).length,
      mediumConfidence: results.filter(r => r.result.confidence > 0.6 && r.result.confidence <= 0.8).length,
      lowConfidence: results.filter(r => r.result.confidence <= 0.6).length
    }
  };
}

module.exports = {
  simulateOCR,
  batchOCR,
  validateOCRContent,
  extractDetectedItems,
  extractDetectedPrices
};
