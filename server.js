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

// Tripo3D AI Configuration
const TRIPO_API_KEY = 'tsk_aAgU5MKf97r6LlwOrVY3q_4TZIPH0cQBwfhmuNWV810';
const TRIPO_API_BASE_URL = 'https://api.tripo3d.ai/v2/openapi';

// Upload image and convert to 3D using Tripo3D
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

        // Call Tripo3D API - Image to 3D
        const apiUrl = `${TRIPO_API_BASE_URL}/task`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TRIPO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'image_to_model',
                file: {
                    type: req.file.mimetype,
                    data: base64Image
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('Tripo3D API Error:', errorData);
            throw new Error(`Tripo3D API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Tripo3D API Response:', data);

        // Clean up uploaded file after processing
        fs.unlinkSync(imagePath);

        res.json({
            success: true,
            taskId: data.data?.task_id || data.task_id,
            message: 'Image uploaded successfully. Processing started with Tripo3D.'
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

// Check task status for Tripo3D
app.get('/api/task-status/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;

        const response = await fetch(`${TRIPO_API_BASE_URL}/task/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TRIPO_API_KEY}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to get task status: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Task Status:', data);

        // Transform Tripo3D response to match our expected format
        const taskData = data.data || data;
        const transformedResponse = {
            status: taskData.status === 'success' ? 'SUCCEEDED' : 
                   taskData.status === 'failed' ? 'FAILED' : 
                   taskData.status === 'running' ? 'PENDING' : 'PENDING',
            progress: taskData.progress || 0,
            model_urls: taskData.output ? {
                glb: taskData.output.model,
                rendered_image: taskData.output.rendered_image
            } : null
        };

        res.json(transformedResponse);

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
