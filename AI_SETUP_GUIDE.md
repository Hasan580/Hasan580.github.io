# AI Image-to-3D Setup Guide | دليل إعداد تحويل الصور إلى 3D

This guide explains how to integrate AI-powered image-to-3D conversion into your website.

## 🎯 Current Status

The website is **fully functional in DEMO MODE** without any API setup. Users can:
- Upload images
- See simulated AI processing
- Download a demo STL file
- Add custom models to cart

## 🚀 Quick Start (Demo Mode)

**No setup required!** Just open `index.html` and:
1. Scroll to "Can't Find What You Love?" section
2. Upload any image
3. Click "Convert to 3D Model"
4. Download the demo STL or add to cart

## 🔧 Production Setup (Real AI)

To enable **real AI conversion**, you need to choose and configure an AI service:

### Option 1: Meshy AI (Recommended) ⭐

**Best for:** High-quality 3D models from images

1. **Sign up:** https://www.meshy.ai/
2. **Pricing:** Free tier available (10 conversions/month)
3. **Get API Key:**
   - Go to Dashboard → API Keys
   - Create new key
   - Copy the key

4. **Update script.js** (lines 11-13):
```javascript
aiApiKey: 'YOUR_MESHY_API_KEY_HERE',
aiApiEndpoint: 'https://api.meshy.ai/v1/image-to-3d'
```

5. **API Features:**
   - Image to 3D mesh
   - Multiple quality levels
   - STL, OBJ, FBX formats
   - 30-120 second processing

### Option 2: Kaedim3D

**Best for:** Professional game-ready models

1. **Sign up:** https://www.kaedim3d.com/
2. **Pricing:** Paid plans from $19/month
3. **Get API Key:**
   - Contact support for API access
   - Receive API credentials

4. **Update script.js:**
```javascript
aiApiKey: 'YOUR_KAEDIM_API_KEY',
aiApiEndpoint: 'https://api.kaedim3d.com/api/v1/upload'
```

5. **Features:**
   - Human-refined models
   - High polygon count
   - Multiple formats
   - 12-hour turnaround

### Option 3: CSM AI

**Best for:** Fast, free conversions

1. **Sign up:** https://csm.ai/
2. **Pricing:** Free tier available
3. **Get API Key:**
   - Dashboard → Settings → API
   - Generate key

4. **Update script.js:**
```javascript
aiApiKey: 'YOUR_CSM_API_KEY',
aiApiEndpoint: 'https://api.csm.ai/v1/generate'
```

### Option 4: Rodin AI (Alpha)

**Best for:** Cutting-edge AI models

1. **Sign up:** https://hyperhuman.deemos.com/rodin
2. **Pricing:** Beta access (free/limited)
3. **Features:**
   - Text to 3D
   - Image to 3D
   - Fast generation

### Option 5: OpenAI Shap-E (Free, Self-hosted)

**Best for:** Developers who want full control

1. **Install Python & Dependencies:**
```bash
pip install shap-e torch torchvision
```

2. **Create API Server:**
```python
from flask import Flask, request, send_file
from shap_e.diffusion.sample import sample_latents
from shap_e.models.download import load_model
import torch

app = Flask(__name__)

@app.route('/api/convert', methods=['POST'])
def convert():
    # Your conversion logic here
    return send_file('model.stl')

app.run(port=5000)
```

3. **Update script.js:**
```javascript
aiApiKey: 'not_needed',
aiApiEndpoint: 'http://localhost:5000/api/convert'
```

## 📝 Detailed Implementation

### Step 1: Choose Your AI Service

Compare features:

| Service | Free Tier | Quality | Speed | Best For |
|---------|-----------|---------|-------|----------|
| **Meshy AI** | ✅ 10/month | ⭐⭐⭐⭐ | Fast (30s) | General use |
| **Kaedim3D** | ❌ Paid | ⭐⭐⭐⭐⭐ | Slow (12h) | Professional |
| **CSM AI** | ✅ Limited | ⭐⭐⭐ | Fast (20s) | Quick tests |
| **Rodin AI** | ✅ Beta | ⭐⭐⭐⭐ | Fast (40s) | Experimental |
| **Shap-E** | ✅ Free | ⭐⭐⭐ | Medium | Self-hosted |

### Step 2: Update Configuration

Open `script.js` and find the CONFIG section:

```javascript
// Configuration - Replace with your email service details
const CONFIG = {
    // ... email config ...
    
    // AI Image to 3D API Configuration
    aiApiKey: 'YOUR_AI_API_KEY',  // ← Replace this
    aiApiEndpoint: 'https://api.meshy.ai/v1/image-to-3d'  // ← And this
};
```

### Step 3: Customize API Call (Optional)

The default implementation works with Meshy AI. For other services, modify the `callAIAPI` function in `script.js` (around line 450):

```javascript
async function callAIAPI(imageData, modelType, modelSize) {
    // Example for different API structure
    const formData = new FormData();
    formData.append('image', imageData);
    formData.append('type', modelType);
    
    const response = await fetch(CONFIG.aiApiEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.aiApiKey}`,
            // Add other headers as needed
        },
        body: formData
    });
    
    // Handle response based on your API
    const result = await response.json();
    return result;
}
```

### Step 4: Handle Different Response Formats

Different APIs return data differently. Update the download function if needed:

```javascript
function downloadSTLFile() {
    // For direct URL
    window.open(currentModelData.modelUrl, '_blank');
    
    // OR for base64 data
    const blob = base64ToBlob(currentModelData.stl_data);
    downloadBlob(blob, 'model.stl');
    
    // OR for blob response
    fetch(currentModelData.downloadUrl)
        .then(res => res.blob())
        .then(blob => downloadBlob(blob, 'model.stl'));
}
```

## 🎨 Customization

### Change Processing Time

Adjust the demo processing time in `script.js`:

```javascript
async function simulateAIProcessing() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // ...
        }, 3000); // Change 3000 to desired milliseconds
    });
}
```

### Modify Pricing

Update custom model pricing in `calculateCustomPrice()`:

```javascript
const basePrices = {
    figure: 200,      // Change these values
    relief: 150,
    lithophane: 120,
    keychain: 80
};
```

### Add More Model Types

1. Update HTML `<select>` in `index.html`:
```html
<option value="custom_type">Custom Type</option>
```

2. Update pricing in `script.js`:
```javascript
const basePrices = {
    // ... existing types ...
    custom_type: 180
};
```

## 🔐 Security Considerations

### Never expose API keys in frontend code for production!

**Better approach:**

1. **Create a Backend Proxy:**
```javascript
// Your server (Node.js example)
app.post('/api/convert-image', async (req, res) => {
    const { image, type, size } = req.body;
    
    // Call AI API with YOUR secret key (server-side)
    const result = await fetch('https://api.meshy.ai/v1/image-to-3d', {
        headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` },
        // ...
    });
    
    res.json(await result.json());
});
```

2. **Update script.js to use your backend:**
```javascript
aiApiEndpoint: 'https://your-domain.com/api/convert-image'
// No API key needed in frontend!
```

## 📊 API Response Monitoring

Add error handling and logging:

```javascript
async function callAIAPI(imageData, modelType, modelSize) {
    try {
        const response = await fetch(CONFIG.aiApiEndpoint, {
            // ... config ...
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('API Error:', error);
            throw new Error(error.message || 'API request failed');
        }
        
        const result = await response.json();
        console.log('API Success:', result);
        return result;
        
    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}
```

## 💡 Tips for Success

1. **Start with Demo Mode:** Test the UI before setting up APIs
2. **Use Free Tiers:** Try multiple services to find the best fit
3. **Cache Results:** Store generated models to avoid re-processing
4. **Set Expectations:** Inform users about processing times
5. **Handle Failures:** Always have fallback messages
6. **Monitor Usage:** Track API calls to avoid exceeding limits

## 🐛 Troubleshooting

### "Conversion error occurred"

**Check:**
- API key is correct
- API endpoint URL is valid
- Image size is within limits
- Internet connection is stable
- Browser console for detailed errors

### Processing takes too long

**Solutions:**
- Reduce image size before upload
- Choose "Fast" quality option if available
- Use a service with faster processing
- Implement polling for status checks

### Downloaded file is corrupted

**Fixes:**
- Verify file format (STL, OBJ, etc.)
- Check API response structure
- Ensure proper binary handling
- Try different export format

### API quota exceeded

**Options:**
- Wait for quota reset (usually monthly)
- Upgrade to paid plan
- Use multiple API services
- Implement user limits

## 📚 Additional Resources

- **Meshy AI Docs:** https://docs.meshy.ai/
- **3D File Formats:** https://en.wikipedia.org/wiki/STL_(file_format)
- **3D Printing Guide:** https://all3dp.com/1/3d-printing-guide/
- **Slicing Software:** Cura, PrusaSlicer (free)

## 🎉 Demo Endpoints (For Testing)

If you want to test without signing up, these mock endpoints can help:

```javascript
// Mock API for development
const MOCK_API = {
    endpoint: 'https://httpbin.org/delay/3',
    response: {
        model_url: 'https://example.com/model.stl',
        format: 'stl',
        status: 'completed'
    }
};
```

## 📞 Support

For issues with:
- **Website code:** Check README.md
- **API integration:** Contact your AI service provider
- **3D printing:** Consult 3D printing communities

---

**Happy 3D Printing! 🎨🖨️**

**طباعة سعيدة! 🎨🖨️**
