# 3D Hub - Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Install Node.js Dependencies**
   ```powershell
   npm install
   ```

2. **Start the Backend Server**
   ```powershell
   npm start
   ```
   
   The server will start on `http://localhost:3000`

3. **Open the Website**
   - Open `index.html` in your browser
   - OR visit `http://localhost:3000/index.html`

## 🌟 Features

### ✅ Completed Features
- **3D Hub Branding** - Updated website name and branding
- **Dark Mode** - Fully functional light/dark theme toggle
- **Backend Server** - Node.js/Express server for image processing
- **AI Image-to-3D Conversion** - Integrated with Meshy AI API
- **Shopping Cart** - Add/remove products, adjust quantities
- **Bilingual Support** - Arabic (RTL) and English (LTR)
- **Iraqi Dinar Currency** - All prices in د.ع (IQD)
- **3D Model Viewer** - Interactive Three.js viewer
- **Order Processing** - Email-based checkout system

## 🛠️ Technical Details

### Backend Server (`server.js`)
- **Port**: 3000
- **Endpoints**:
  - `POST /api/convert-to-3d` - Upload image and start conversion
  - `GET /api/task-status/:taskId` - Check conversion status
  - `GET /api/health` - Health check endpoint

### Image Processing Flow
1. User uploads image through frontend
2. Image sent to backend server via FormData
3. Backend converts image to base64 and sends to Meshy AI
4. Backend polls Meshy AI for task completion
5. Frontend receives 3D model URL
6. Three.js viewer loads and displays model

### Dark Mode Implementation
- Uses Tailwind CSS `dark:` classes
- Configured with `darkMode: 'class'`
- Theme preference saved in localStorage
- Smooth transitions between themes

## 🐛 Troubleshooting

### Dark Mode Not Working
✅ **FIXED** - Added Tailwind dark mode configuration and updated all sections with dark mode classes

### Image Upload Fails
✅ **FIXED** - Backend server handles image processing instead of direct API calls from browser (avoids CORS issues)

### Three.js Errors
✅ **FIXED** - Using proper importmap configuration with unpkg CDN

## 📁 Project Structure
```
zain website/
├── index.html          # Main website file
├── styles.css          # Custom styles and animations
├── script.js           # Frontend JavaScript
├── server.js           # Backend Node.js server
├── package.json        # Node.js dependencies
├── IMG_1778.PNG        # Logo
├── uploads/            # (Auto-created) Temporary image storage
└── README_SETUP.md     # This file
```

## 🔑 API Configuration

The Meshy AI API key is configured in `server.js`:
```javascript
const MESHY_API_KEY = 'msy_USuAj3KUFCgcnz0OQdp3IHlmFQyoqQlMBKZZ';
```

**Note**: Keep this key secure! Don't commit it to public repositories.

## 🌐 Development vs Production

### Development (Current Setup)
- Backend: `http://localhost:3000`
- Frontend: Open `index.html` in browser

### For Production Deployment
1. Update `CONFIG.backendUrl` in `script.js` to your production server URL
2. Deploy backend server to a hosting service (Heroku, DigitalOcean, AWS, etc.)
3. Deploy frontend to web hosting or serve it through the same server

## 💡 Tips

- Keep the backend server running while using the website
- Images are temporarily stored in `uploads/` folder and auto-deleted after processing
- Maximum image size: 10MB
- Supported formats: JPEG, PNG, WebP
- Conversion time: 30-90 seconds typically

## 📞 Support

For issues or questions, check the console logs:
- Browser Console (F12) for frontend errors
- Terminal/PowerShell for backend server logs

---

**Created**: November 2024  
**Version**: 1.0  
**Status**: ✅ All features working
