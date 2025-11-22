const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
    }
});

// Meshy AI Configuration
const MESHY_API_KEY = 'msy_USuAj3KUFCgcnz0OQdp3IHlmFQyoqQlMBKZZ';
const MESHY_API_BASE_URL = 'https://api.meshy.ai';
const MESHY_API_VERSION = 'v2';

// Upload image and convert to 3D
app.post('/api/convert-to-3d', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log('Image uploaded:', req.file.filename);

        // Read the uploaded image file
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const imageDataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        // Call Meshy AI API - Text to 3D Preview endpoint
        const apiUrl = `${MESHY_API_BASE_URL}/${MESHY_API_VERSION}/text-to-3d`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MESHY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: 'preview',
                prompt: 'A 3D model converted from an uploaded image',
                art_style: 'realistic',
                negative_prompt: 'low quality, low resolution, blurry'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('Meshy API Error:', errorData);
            throw new Error(`Meshy API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Meshy API Response:', data);

        // Clean up uploaded file after processing
        fs.unlinkSync(imagePath);

        res.json({
            success: true,
            taskId: data.result || data.id || data.task_id,
            message: 'Image uploaded successfully. Processing started.'
        });

    } catch (error) {
        console.error('Error in convert-to-3d:', error);
        
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process image'
        });
    }
});

// Check task status
app.get('/api/task-status/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;

        const response = await fetch(`${MESHY_API_BASE_URL}/${MESHY_API_VERSION}/text-to-3d/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MESHY_API_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to get task status: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Task Status:', data);

        res.json(data);

    } catch (error) {
        console.error('Error checking task status:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to check task status'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '3D Hub Backend Server is running' });
});

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 3D Hub Backend Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🖼️  Upload endpoint: http://localhost:${PORT}/api/convert-to-3d`);
    console.log(`\n✅ Open your browser and visit: http://localhost:${PORT}`);
});
