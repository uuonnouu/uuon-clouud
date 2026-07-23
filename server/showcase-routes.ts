import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    name: 'Shape Showcase',
    version: '1.0.0',
    description: 'Manage and display curated interactive showcases — HTML embeds, Sketchfab models, and uploaded 3D files',
    endpoints: [
      { method: 'GET',    path: '/items', description: 'List all showcase items' },
      { method: 'GET',    path: '/items/:id', description: 'Get a specific showcase item' },
      { method: 'POST',   path: '/upload-html', description: 'Upload and store an interactive HTML file' },
      { method: 'POST',   path: '/add-sketchfab', description: 'Register a Sketchfab embed code' },
      { method: 'POST',   path: '/add-model', description: 'Register a 3D model URL' },
      { method: 'DELETE', path: '/items/:id', description: 'Delete a showcase item and its files' }
    ],
    docs: '/api/sdk-info'
  });
});

const SHOWCASE_DIR = path.join(process.cwd(), 'uploads', 'showcase');

if (!fs.existsSync(SHOWCASE_DIR)) {
  fs.mkdirSync(SHOWCASE_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SHOWCASE_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    cb(null, `${uniqueId}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
      cb(null, true);
    } else {
      cb(new Error('Only HTML files are allowed'));
    }
  }
});

interface ShowcaseItem {
  id: string;
  type: 'html' | 'sketchfab' | 'model';
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  createdAt: string;
}

let showcaseItems: ShowcaseItem[] = [];

const SHOWCASE_DATA_FILE = path.join(SHOWCASE_DIR, 'showcase-data.json');
try {
  if (fs.existsSync(SHOWCASE_DATA_FILE)) {
    const data = fs.readFileSync(SHOWCASE_DATA_FILE, 'utf-8');
    showcaseItems = JSON.parse(data);
  }
} catch (error) {
  console.log('Initializing showcase data...');
}

function saveShowcaseData() {
  try {
    fs.writeFileSync(SHOWCASE_DATA_FILE, JSON.stringify(showcaseItems, null, 2));
  } catch (error) {
    console.error('Error saving showcase data:', error);
  }
}

router.get('/items', (req, res) => {
  res.json({
    success: true,
    items: showcaseItems,
    count: showcaseItems.length
  });
});

router.post('/upload-html', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description } = req.body;
    const fileUrl = `/uploads/showcase/${req.file.filename}`;

    const item: ShowcaseItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      type: 'html',
      title: title || req.file.originalname.replace('.html', ''),
      description: description || undefined,
      content: fileUrl,
      createdAt: new Date().toISOString()
    };

    showcaseItems.push(item);
    saveShowcaseData();

    res.json({
      success: true,
      item,
      message: 'HTML file uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading HTML:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.post('/add-sketchfab', (req, res) => {
  try {
    const { title, description, embedCode } = req.body;

    if (!embedCode || !title) {
      return res.status(400).json({ error: 'Title and embed code are required' });
    }

    const item: ShowcaseItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      type: 'sketchfab',
      title,
      description: description || undefined,
      content: embedCode,
      createdAt: new Date().toISOString()
    };

    showcaseItems.push(item);
    saveShowcaseData();

    res.json({
      success: true,
      item,
      message: 'Sketchfab embed added successfully'
    });
  } catch (error) {
    console.error('Error adding Sketchfab:', error);
    res.status(500).json({ error: 'Failed to add Sketchfab embed' });
  }
});

router.post('/add-model', (req, res) => {
  try {
    const { title, description, modelUrl } = req.body;

    if (!modelUrl || !title) {
      return res.status(400).json({ error: 'Title and model URL are required' });
    }

    const item: ShowcaseItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      type: 'model',
      title,
      description: description || undefined,
      content: modelUrl,
      createdAt: new Date().toISOString()
    };

    showcaseItems.push(item);
    saveShowcaseData();

    res.json({
      success: true,
      item,
      message: '3D model added successfully'
    });
  } catch (error) {
    console.error('Error adding model:', error);
    res.status(500).json({ error: 'Failed to add 3D model' });
  }
});

router.delete('/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = showcaseItems.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = showcaseItems[itemIndex];
    
    if (item.type === 'html' && item.content.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), item.content);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    showcaseItems.splice(itemIndex, 1);
    saveShowcaseData();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = showcaseItems.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({
    success: true,
    item
  });
});

export { router as showcaseRoutes };
