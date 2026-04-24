# Sales KPI Analytics Dashboard

A modern, production-ready analytics dashboard that connects to the Sales KPI Analytics Backend. This frontend provides real-time insights into sales performance, metrics, and business intelligence.

## 🚀 Features

- **Real-time KPI Dashboard**: Live revenue, orders, and AOV metrics
- **Interactive Charts**: Revenue trends, product performance, and comparisons
- **Business Insights**: Automated insights and analysis
- **Alert System**: Real-time alerts for anomalies and opportunities
- **Performance Analysis**: Deep dive into trends and patterns
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API Integration**: Custom API client with TypeScript types

## 📡 Backend Integration

This dashboard connects to the Sales KPI Analytics Backend API:

- **Development**: `http://localhost:8000`
- **Production**: Deployed on Vercel

### API Endpoints Used

- `/kpis` - Key performance indicators
- `/revenue-trend` - Revenue trends data
- `/insights` - Business insights
- `/alerts` - Real-time alerts
- `/analysis` - Performance analysis
- `/products` - Product metrics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your API URL in `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Available Pages

### Overview Dashboard
- Total revenue and orders
- Average order value
- Growth trends
- Top performing products
- Key business insights

### Detailed Metrics
- Daily/weekly/monthly KPIs
- Revenue trends comparison
- Order volume analysis
- AOV tracking

### Business Insights
- Performance highlights
- Product analysis
- Business health metrics
- Automated recommendations

### Alerts Management
- Real-time alerts
- Severity filtering
- Actionable recommendations
- Alert history

### Performance Analysis
- Category performance
- Revenue trends
- Top products analysis
- Conversion funnel

## 🎨 Customization

### Theming
The dashboard uses CSS custom properties for theming. Modify `default_shadcn_theme.css` to customize colors and styles.

### API Configuration
Update the API client in `src/app/lib/api.ts` to:
- Add new endpoints
- Modify data transformations
- Update error handling

### Adding New Charts
1. Import chart components from `recharts`
2. Add chart containers in `src/app/components/`
3. Update page components with new charts

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Environment Variables**
   Set `VITE_API_URL` to your production backend URL.

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

### API Client Configuration

The API client (`src/app/lib/api.ts`) includes:
- Automatic error handling
- Request/response interceptors
- Type-safe API calls
- Data formatting utilities

## 📊 Data Flow

```
Frontend (React) → API Client → Backend API → Database
     ↓              ↓            ↓           ↓
   UI Components  → HTTP Requests  → FastAPI  → SQLite
```

1. **User Interaction**: Triggers data fetch
2. **API Client**: Makes HTTP request to backend
3. **Backend**: Returns precomputed metrics
4. **Frontend**: Updates UI with real data

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check backend is running
   - Verify `VITE_API_URL` in `.env.local`
   - Check CORS settings on backend

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies installed

3. **Missing Data**
   - Run backend preprocessing pipeline
   - Check database connection
   - Verify API endpoints are accessible

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Open an issue on GitHub

---

**Built with ❤️ for fast, scalable analytics**