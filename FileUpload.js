const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Only allow .reg files
    if (path.extname(file.originalname).toLowerCase() !== '.reg') {
      return cb(new Error('Only .reg files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post('/api/analyze-registry', upload.single('regFile'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Parse and analyze
    const analysisResult = await analyzeRegistry(fileContent);
    
    // Clean up uploaded file
    await fs.unlink(filePath);
    
    res.json(analysisResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
