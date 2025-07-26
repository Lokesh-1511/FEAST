/**
 * File Upload Utility
 * Handles file uploads to Firebase Storage using multer
 * Supports vendor photos, proof images, and other document uploads
 */

const multer = require('multer');
const { storage } = require('../config/firebaseAdmin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

/**
 * Upload single file to Firebase Storage
 * @param {Object} file - Multer file object
 * @param {string} folder - Storage folder path
 * @param {string} vendorId - Vendor ID for file organization
 * @returns {Promise<string>} Public URL of uploaded file
 */
async function uploadToFirebase(file, folder = 'general', vendorId = null) {
  try {
    const bucket = storage.bucket();
    const fileName = generateFileName(file.originalname, vendorId);
    const filePath = `${folder}/${fileName}`;
    
    const fileUpload = bucket.file(filePath);
    
    // Create write stream
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          uploadedBy: vendorId || 'unknown',
          uploadedAt: new Date().toISOString(),
          originalName: file.originalname,
          fileSize: file.size
        }
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('❌ Firebase upload error:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Make file publicly accessible
          await fileUpload.makePublic();
          
          // Get public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
          
          console.log(`✅ File uploaded successfully: ${filePath}`);
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      });

      // Write file buffer to stream
      stream.end(file.buffer);
    });

  } catch (error) {
    console.error('❌ Error uploading to Firebase:', error);
    throw error;
  }
}

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @param {string} vendorId - Vendor ID for prefix
 * @returns {string} Generated filename
 */
function generateFileName(originalName, vendorId = null) {
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, '_');
  
  const prefix = vendorId ? `${vendorId}_` : '';
  return `${prefix}${timestamp}_${uuid}_${baseName}${extension}`;
}

/**
 * Main upload handler middleware
 */
const handleFileUpload = async (req, res) => {
  try {
    // Use multer to parse multipart form data
    const uploadMiddleware = upload.array('files', 5);
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('❌ Multer error:', err.message);
        return res.status(400).json({
          error: 'File upload failed',
          message: err.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: 'No files provided',
          message: 'Please select at least one file to upload'
        });
      }

      const { uploadType = 'general', vendorId } = req.body;
      const uploadedFiles = [];
      const errors = [];

      // Process each file
      for (const file of req.files) {
        try {
          // Validate file
          const validation = validateFile(file, uploadType);
          if (!validation.valid) {
            errors.push({
              filename: file.originalname,
              error: validation.error
            });
            continue;
          }

          // Determine storage folder based on upload type
          const folder = getStorageFolder(uploadType);
          
          // Upload to Firebase
          const publicUrl = await uploadToFirebase(file, folder, vendorId);
          
          uploadedFiles.push({
            originalName: file.originalname,
            url: publicUrl,
            size: file.size,
            mimetype: file.mimetype,
            uploadType: uploadType,
            uploadedAt: new Date().toISOString()
          });

        } catch (uploadError) {
          console.error(`❌ Error uploading ${file.originalname}:`, uploadError);
          errors.push({
            filename: file.originalname,
            error: uploadError.message
          });
        }
      }

      // Prepare response
      const response = {
        success: uploadedFiles.length > 0,
        uploadedFiles: uploadedFiles,
        totalUploaded: uploadedFiles.length,
        totalRequested: req.files.length
      };

      if (errors.length > 0) {
        response.errors = errors;
        response.partialSuccess = uploadedFiles.length > 0 && errors.length > 0;
      }

      const statusCode = uploadedFiles.length > 0 ? 200 : 400;
      
      console.log(`📁 Upload completed: ${uploadedFiles.length}/${req.files.length} files successful`);
      
      res.status(statusCode).json(response);
    });

  } catch (error) {
    console.error('❌ Upload handler error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Internal server error during file upload'
    });
  }
};

/**
 * Validate uploaded file based on type
 * @param {Object} file - Multer file object
 * @param {string} uploadType - Type of upload
 * @returns {Object} Validation result
 */
function validateFile(file, uploadType) {
  const validations = {
    'vendor-photo': {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      minDimensions: { width: 300, height: 300 }
    },
    'proof-photo': {
      maxSize: 8 * 1024 * 1024, // 8MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
      minDimensions: { width: 200, height: 200 }
    },
    'document': {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      minDimensions: null
    },
    'general': {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
      minDimensions: null
    }
  };

  const rules = validations[uploadType] || validations['general'];

  // Check file size
  if (file.size > rules.maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum allowed: ${rules.maxSize / 1024 / 1024}MB`
    };
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${rules.allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Get storage folder based on upload type
 * @param {string} uploadType - Type of upload
 * @returns {string} Storage folder path
 */
function getStorageFolder(uploadType) {
  const folders = {
    'vendor-photo': 'vendors/photos',
    'proof-photo': 'prices/proofs',
    'surplus-photo': 'surplus/photos',
    'document': 'documents',
    'general': 'uploads'
  };

  return folders[uploadType] || 'uploads';
}

/**
 * Delete file from Firebase Storage
 * @param {string} fileUrl - Public URL of the file to delete
 * @returns {Promise<boolean>} Success status
 */
async function deleteFromFirebase(fileUrl) {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const bucketName = urlParts[3];
    const filePath = urlParts.slice(4).join('/');

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    await file.delete();
    
    console.log(`✅ File deleted successfully: ${filePath}`);
    return true;

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return false;
  }
}

/**
 * Get file metadata from Firebase Storage
 * @param {string} fileUrl - Public URL of the file
 * @returns {Promise<Object>} File metadata
 */
async function getFileMetadata(fileUrl) {
  try {
    const urlParts = fileUrl.split('/');
    const bucketName = urlParts[3];
    const filePath = urlParts.slice(4).join('/');

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    const [metadata] = await file.getMetadata();
    
    return {
      success: true,
      metadata: {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType,
        created: metadata.timeCreated,
        updated: metadata.updated,
        customMetadata: metadata.metadata
      }
    };

  } catch (error) {
    console.error('❌ Error getting file metadata:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate signed URL for temporary access
 * @param {string} filePath - File path in storage
 * @param {number} expiresInMinutes - Expiration time in minutes
 * @returns {Promise<string>} Signed URL
 */
async function generateSignedUrl(filePath, expiresInMinutes = 60) {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000
    };

    const [signedUrl] = await file.getSignedUrl(options);
    
    return signedUrl;

  } catch (error) {
    console.error('❌ Error generating signed URL:', error);
    throw error;
  }
}

module.exports = handleFileUpload;

// Export utility functions for use in other modules
module.exports.uploadToFirebase = uploadToFirebase;
module.exports.deleteFromFirebase = deleteFromFirebase;
module.exports.getFileMetadata = getFileMetadata;
module.exports.generateSignedUrl = generateSignedUrl;
