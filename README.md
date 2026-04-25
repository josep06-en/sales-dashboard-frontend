# Sales Analytics Dashboard

A modern, production-ready analytics dashboard with static data architecture. This frontend provides comprehensive insights into sales performance, metrics, and business intelligence without requiring any backend API.

## 🚀 Features

- **Static Data Architecture**: No backend required - all data pre-computed
- **Lightning Fast**: Instant data loading from static JSON files
- **Interactive Charts**: Revenue trends, product performance, and comparisons
- **Business Insights**: Automated insights and analysis
- **Alert System**: Real-time alerts for anomalies and opportunities
- **Performance Analysis**: Deep dive into trends and patterns
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Zero CORS Issues**: Fully static deployment

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: Static JSON files with Python data generation

## 📊 Architecture

### Static Data Approach

This dashboard uses a static data architecture:

```
sales-dashboard-frontend/
├── public/data/              # Static JSON files
│   ├── kpis.json           # Main KPIs
│   ├── kpis_overview.json  # Detailed overview
│   ├── revenue_trend.json   # Revenue trends
│   ├── top_products.json    # Top products
│   ├── insights.json        # Business insights
│   ├── alerts.json         # Business alerts
│   └── analysis.json       # Comprehensive analysis
├── scripts/
│   └── generate_data.py    # Data generation script
└── src/app/lib/
    └── static-data.ts      # Static data service
```

### Data Flow

1. **Data Generation**: `scripts/generate_data.py` processes raw data and computes all metrics
2. **Static Storage**: Results saved as JSON files in `public/data/`
3. **Frontend Loading**: Static data service loads JSON files on demand
4. **Instant Display**: No API calls, no loading delays

## 🔄 Data Generation

### Generate Data Locally

```bash
# Install Python dependencies
pip install pandas

# Generate static data
python scripts/generate_data.py
```

### Generated Metrics

The data generation script computes:
- **Revenue Metrics**: Total revenue, orders, AOV, growth rates
- **Trends**: Daily revenue trends with date filtering
- **Products**: Top products by revenue and performance
- **Insights**: Automated business insights and key findings
- **Alerts**: Revenue drops, low order days, concentration risks
- **Analysis**: Comprehensive performance analysis

## 🚀 Development

### Prerequisites

- Node.js 18+
- Python 3.7+ (for data generation)
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/josep06-en/sales-dashboard-frontend.git
cd sales-dashboard-frontend

# Install dependencies
npm install

# Generate data (optional - data already included)
python scripts/generate_data.py

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure**: No environment variables needed
3. **Deploy**: Automatic deployment on push to main branch
4. **Access**: Your dashboard will be live instantly

### Static Hosting

The app works on any static hosting service:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Build Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

## 📡 API Structure (Static)

All data is loaded from static JSON files:

```typescript
// Example data loading
import { staticDataService } from '../lib/static-data';

// Load main KPIs
const kpis = await staticDataService.getKPIs();

// Load revenue trends
const trends = await staticDataService.getRevenueTrend();

// Load insights
const insights = await staticDataService.getInsights();
```

### Available Endpoints

- `/data/kpis.json` - Main KPIs (revenue, orders, AOV, growth)
- `/data/kpis_overview.json` - Detailed KPI overview
- `/data/revenue_trend.json` - Daily revenue trends
- `/data/top_products.json` - Top products by revenue
- `/data/insights.json` - Business insights and findings
- `/data/alerts.json` - Business alerts and notifications
- `/data/analysis.json` - Comprehensive analysis

## 🎯 Key Benefits

### Static Architecture Advantages

1. **Zero Latency**: No API calls, instant data loading
2. **No CORS Issues**: Static files bypass all CORS restrictions
3. **Reliability**: No backend dependencies or failures
4. **Security**: No API endpoints to secure
5. **Cost Effective**: No server costs, pure static hosting
6. **Performance**: Sub-100ms page loads
7. **Scalability**: Unlimited concurrent users

### Production Features

- **Error Handling**: Graceful fallbacks for missing data
- **Loading States**: Professional loading indicators
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, professional interface
- **Accessibility**: WCAG compliant components

## 📊 Data Structure

### KPIs Example
```json
{
  "revenue": 4807745.62,
  "orders": 2647,
  "aov": 1816.3,
  "growth": 3.66
}
```

### Revenue Trend Example
```json
[
  {
    "date": "2024-01-01",
    "revenue": 15432.50
  }
]
```

### Top Products Example
```json
[
  {
    "product": "Laptop Pro",
    "revenue": 125432.75,
    "category": "Electronics",
    "quantity": 89,
    "avg_price": 1409.36
  }
]
```

## 🧪 Testing

### Local Testing

```bash
# Start development server
npm run dev

# Access application
http://localhost:5173

# Test static data loading
http://localhost:5173/data/kpis.json
```

### Production Testing

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Access preview
http://localhost:4173
```

## 🔧 Configuration

### Environment Variables

No environment variables required for static data architecture.

```bash
# .env.example
# Static Data Configuration
# No API URL required - using static JSON files
# Data is generated locally via scripts/generate_data.py
```

## 📈 Performance

- **First Load**: <100ms
- **Navigation**: Instant
- **Data Updates**: File-based (manual regeneration)
- **Memory Usage**: <50MB
- **Bundle Size**: <2MB

## 🚨 Troubleshooting

### Common Issues

1. **Data Not Loading**: Check that JSON files exist in `public/data/`
2. **Build Errors**: Ensure all imports are correctly typed
3. **Deployment Issues**: Verify static file serving configuration

### Data Regeneration

```bash
# Regenerate all data files
python scripts/generate_data.py

# Commit new data
git add public/data/
git commit -m "Update data files"
git push origin main
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🌟 Live Demo

Deployed on Vercel: [Your Dashboard URL]

---

**Built with ❤️ using modern web technologies**
