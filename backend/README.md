# FEAST Backend API

A comprehensive Node.js + Express backend for the FEAST (Food Essentials Access & Supply Tracking) platform, providing RESTful APIs for vendor management, price tracking, surplus exchange, and emergency supply coordination.

## 🚀 Features

- **Vendor Management**: Registration, verification, and profile management
- **Price Tracking**: Crowd-verified mandi prices with OCR validation
- **Surplus Exchange**: Surplus stock sharing between vendors
- **Emergency Supplies**: Urgent supply request coordination
- **AI Integration**: Placeholder routes for Python AI service integration
- **File Uploads**: Firebase Storage integration for photos and documents
- **Real-time Data**: Firebase Firestore for scalable data storage

## 🛠️ Technology Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Admin SDK
- **File Upload**: Multer
- **Environment**: dotenv
- **Development**: Nodemon

## 📋 Prerequisites

- Node.js 16 or higher
- Firebase project with Firestore and Storage enabled
- Firebase Admin SDK service account key

## 🔧 Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials:
   ```env
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```http
GET /api/health
```

### Vendors
```http
POST   /api/vendors/register    # Register new vendor
GET    /api/vendors/:id         # Get vendor profile
PUT    /api/vendors/:id         # Update vendor details
GET    /api/vendors             # Get all vendors
POST   /api/vendors/:id/verify  # Verify vendor (admin)
```

### Prices
```http
POST   /api/prices/add               # Add price entry with proof
GET    /api/prices                  # Get all prices
GET    /api/prices/trends/:item     # Get price trends
PUT    /api/prices/:id/verify       # Verify price entry
POST   /api/prices/:id/vote         # Vote on price entry
```

### Surplus
```http
POST   /api/surplus/add        # Add surplus stock
GET    /api/surplus            # Get available surplus
PUT    /api/surplus/:id/claim  # Claim surplus stock
PUT    /api/surplus/:id/complete # Mark exchange complete
DELETE /api/surplus/:id        # Remove surplus
```

### Emergency
```http
POST   /api/emergency/add         # Create emergency request
GET    /api/emergency             # Get emergency requests
PUT    /api/emergency/:id/respond # Respond to emergency
PUT    /api/emergency/:id/fulfill # Fulfill emergency request
PUT    /api/emergency/:id/cancel  # Cancel emergency request
```

### AI Services (Placeholder)
```http
GET    /api/ai/price-prediction    # Get price predictions
POST   /api/ai/quantity-optimizer  # Get quantity optimization
GET    /api/ai/market-insights     # Get market insights
POST   /api/ai/demand-forecast     # Get demand forecast
GET    /api/ai/status              # Check AI service status
```

### File Upload
```http
POST   /api/upload               # Upload files to Firebase Storage
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── firebaseAdmin.js        # Firebase configuration
├── routes/
│   ├── vendors.js              # Vendor management routes
│   ├── prices.js               # Price tracking routes
│   ├── surplus.js              # Surplus exchange routes
│   ├── emergency.js            # Emergency supply routes
│   └── ai.js                   # AI service placeholder routes
├── utils/
│   ├── ocr.js                  # OCR simulation utility
│   └── upload.js               # File upload utility
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
├── server.js                   # Main server file
└── README.md                   # This file
```

## 🔥 Firebase Collections

### vendors
```javascript
{
  id: string,
  name: string,
  shopName: string,
  location: {
    address: string,
    city: string,
    state: string,
    coordinates: { lat: number, lng: number }
  },
  timings: {
    openTime: string,
    closeTime: string,
    daysOpen: string[]
  },
  rawMaterials: string[],
  verified: boolean,
  photoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### prices
```javascript
{
  id: string,
  vendorId: string,
  item: string,
  price: number,
  unit: string,
  proofPhotoURL: string,
  verified: boolean,
  ocrValidation: object,
  timestamp: timestamp
}
```

### surplus
```javascript
{
  id: string,
  vendorId: string,
  item: string,
  quantity: number,
  originalPrice: number,
  discountedPrice: number,
  status: string, // available, claimed, completed
  claimedBy: object,
  createdAt: timestamp
}
```

### emergency
```javascript
{
  id: string,
  vendorId: string,
  item: string,
  quantity: number,
  urgencyLevel: string, // low, medium, high, critical
  neededBy: timestamp,
  status: string, // active, fulfilled, expired
  responses: array,
  createdAt: timestamp
}
```

## 🧪 Testing

### Manual API Testing

Use tools like Postman, Insomnia, or curl to test the endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register vendor
curl -X POST http://localhost:5000/api/vendors/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "shopName": "Fresh Vegetables Store",
    "location": {
      "address": "123 Market Street",
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }'
```

### File Upload Testing

```bash
# Upload file
curl -X POST http://localhost:5000/api/upload \
  -F "files=@/path/to/image.jpg" \
  -F "uploadType=vendor-photo" \
  -F "vendorId=vendor-123"
```

## 🔧 Development

### Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_CLIENT_EMAIL` | Service account email | Yes |
| `FIREBASE_PRIVATE_KEY` | Service account private key | Yes |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket name | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `AI_SERVICE_URL` | Python AI service URL | No |
| `AI_SERVICE_ENABLED` | Enable AI features | No |

## 🤖 AI Integration

The backend includes placeholder routes for AI services that will be handled by a separate Python service:

- **Price Prediction**: Historical data analysis and future price forecasting
- **Quantity Optimization**: Inventory optimization based on demand patterns
- **Market Insights**: Trend analysis and market intelligence
- **Demand Forecasting**: Predictive analytics for supply planning

To integrate with actual Python AI service:
1. Set `AI_SERVICE_ENABLED=true` in `.env`
2. Configure `AI_SERVICE_URL` to point to your Python service
3. Update the AI routes to make HTTP requests to the Python service

## 🚀 Deployment

### Production Checklist

1. **Environment Setup**:
   - Set `NODE_ENV=production`
   - Use production Firebase credentials
   - Configure proper CORS origins

2. **Security**:
   - Enable Firebase security rules
   - Set up proper authentication
   - Configure rate limiting

3. **Monitoring**:
   - Set up logging
   - Configure error tracking
   - Monitor Firebase usage

### Deployment Options

- **Railway**: Simple deployment with automatic builds
- **Heroku**: Classic platform with easy integration
- **Google Cloud Run**: Serverless container deployment
- **AWS ECS**: Container orchestration
- **DigitalOcean App Platform**: Managed application platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the GitHub issues
- Review the API documentation
- Test with the health check endpoint
- Verify Firebase configuration

## 🔄 Updates

### Version 1.0.0
- Initial release with core functionality
- Vendor management system
- Price tracking with OCR simulation
- Surplus exchange platform
- Emergency supply coordination
- Firebase integration
- File upload capabilities
- AI service placeholders

---

**FEAST Backend** - Empowering food supply chain coordination through technology 🍎🚚📊
