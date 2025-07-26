# FEAST - Food Essentials Access & Supply Tracking

A comprehensive React + Vite web application designed for food vendors and suppliers to streamline their operations through AI insights, market tools, and logistics coordination.

## 🌟 Features

### Vendor Tools
- **Vendor Proof Token (VPT)**: Complete verification system with photo upload and geolocation
- **Emergency Supply Mode**: Urgent supply request board for community needs

### AI Insights
- **AI Price Whisperer**: Smart price trend analysis with interactive charts
- **AI Quantity Optimizer**: Inventory optimization based on sales patterns

### Market Tools
- **Crowd-Verified Mandi Prices**: Real-time market prices verified by the community
- **Multi-Supplier Price Split**: Compare prices across different suppliers

### Logistics
- **Surplus-to-Shortage Exchange**: Connect surplus inventory with shortage needs
- **Smart Split Logistics**: Share delivery costs with other vendors
- **Delivery Slot Pooling**: Join shared delivery slots to reduce costs

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd F.E.A.S.T
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Heroicons

## 📱 Pages

### Dashboard
The main interface featuring all 9 core features organized into intuitive sections:
- Interactive cards for each feature
- Modal forms for data input
- Real-time dummy data visualization

### Profile
Vendor information management with:
- Personal and business details form
- VPT verification process
- Progress tracking and status indicators

## 🎯 Usage

1. **Getting Started**: Navigate to the Dashboard to explore all features
2. **Vendor Verification**: Visit the Profile page to complete your VPT verification
3. **Market Analysis**: Use AI insights to make informed pricing and inventory decisions
4. **Cost Optimization**: Leverage logistics tools to reduce delivery costs
5. **Community Engagement**: Participate in surplus exchanges and price verification

## 📊 Demo Data

The application includes comprehensive dummy data for demonstration:
- Sample market prices and trends
- Mock vendor profiles and verification status
- Simulated surplus/shortage listings
- Example delivery routes and time slots

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── FeatureCard.jsx
│   └── PriceChart.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── App.jsx
└── main.jsx
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Philosophy

- **User-Centric**: Intuitive interface designed for vendors with varying technical skills
- **Mobile-First**: Responsive design that works on all devices
- **Performance**: Optimized for fast loading and smooth interactions
- **Accessibility**: Following web accessibility guidelines

## 🚀 Future Enhancements

- Real-time data integration
- Push notifications for urgent supplies
- Advanced analytics dashboard
- Multi-language support
- Mobile app development

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
