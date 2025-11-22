# AI Converter Setup Guide

## Current Status

The AI converter page is now working in **DEMO MODE**. Users can:
- ✅ Upload images (click or drag & drop)
- ✅ See image preview
- ✅ Click "Convert to 3D Model"
- ✅ See processing animation with progress
- ✅ View a demo 3D model
- ✅ Download the demo model
- ✅ Add to cart for custom printing

## How to Enable Real AI Conversion

To connect the converter to a real AI service, you need to set up a backend server with Meshy AI.

### Option 1: Use Meshy AI (Recommended)

1. **Sign up for Meshy AI:**
   - Go to: https://www.meshy.ai/
   - Create a free account
   - Get your API key from the dashboard

2. **Configure the backend:**
   - Open `server.js`
   - Replace the API key on line 42:
     ```javascript
     const MESHY_API_KEY = 'your_actual_api_key_here';
     ```

3. **Run the backend server locally:**
   ```bash
   npm install
   node server.js
   ```
   Server will run on http://localhost:3000

4. **Disable demo mode:**
   - Open `script.js`
   - Find line 15 and change:
     ```javascript
     demoMode: false // Set to false when you have a working backend
     ```

5. **Test locally:**
   - Visit http://localhost:8080/converter.html
   - Upload an image and convert it

### Option 2: Deploy Backend to Heroku/Vercel

For GitHub Pages to work with the AI converter, you need to deploy the backend:

1. **Deploy to Heroku:**
   ```bash
   # Install Heroku CLI
   heroku login
   heroku create your-3d-converter-api
   git push heroku main
   ```

2. **Update CONFIG in script.js:**
   ```javascript
   backendUrl: 'https://your-3d-converter-api.herokuapp.com',
   ```

### Option 3: Contact Users to Order Custom Prints

The current setup allows users to:
- Upload images
- See a demo conversion
- **Add to cart** and submit an order with their image

You can then manually process their images and create the 3D models.

## How It Works Now (Demo Mode)

1. User uploads an image ✅
2. Image preview shows ✅
3. User clicks "Convert to 3D Model" ✅
4. Processing animation shows (3 seconds) ✅
5. Demo 3D model appears (a simple box from Khronos glTF samples) ✅
6. User can:
   - View the 3D model (rotate with mouse)
   - Download the demo GLB file
   - **Order custom print** → adds to cart with their uploaded image

## Troubleshooting

### Upload button not working?
- **Fixed!** The click handler now properly triggers the file input
- Try: Click anywhere on the upload area (not just the icon)
- Try: Drag and drop an image file

### Image not showing preview?
- Check file size (must be under 10MB)
- Check file type (JPG, PNG, WEBP only)
- Check browser console for errors (F12)

### Convert button not responding?
- Make sure you uploaded an image first
- Check if the image preview is visible
- Demo mode will show a simple box model after 3 seconds

## Files Involved

- **converter.html** - The AI converter page UI
- **script.js** - Frontend logic (lines 915-1250)
- **server.js** - Backend API for Meshy AI integration
- **CONFIG** (script.js line 2-16) - Configuration settings

## Cost Considerations

**Meshy AI Pricing:**
- Free tier: Limited credits per month
- Pay-as-you-go: ~$0.10-0.50 per conversion
- Monthly plans available

**Alternative:** Keep demo mode and manually process orders when customers submit them through the cart system.

## Current Configuration

```javascript
CONFIG = {
    backendUrl: auto-detects (localhost or GitHub Pages),
    demoMode: true,
    pollInterval: 5000ms,
    maxPollTime: 5 minutes
}
```

## Next Steps

1. **Test the upload functionality:**
   - Visit your website: https://hasan580.github.io/converter.html
   - Click on the upload area
   - Select an image
   - Click "Convert to 3D Model"
   - Should see demo processing and result

2. **If you want real AI conversion:**
   - Follow Option 1 or 2 above
   - You'll need to deploy a backend server

3. **If demo mode is sufficient:**
   - Keep it as is
   - Users can still order custom prints
   - You process their images manually

---

**Need help?** The upload issue is now fixed! Try uploading an image and see if it works.
