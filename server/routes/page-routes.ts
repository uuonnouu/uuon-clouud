
import { Router } from 'express';
import path from 'path';

const router = Router();

// Serve the main React app for all these routes
const pageRoutes = [

  '/api-docs',
  '/documentation',
  '/tutorials',
  '/gallery',
  '/community',
  '/research',
  '/enterprise',
  '/about',
  '/categories',
  '/export',
  '/explore',
  '/formulas',
  '/omni-proofs',
  '/fractal-biosystem',
  '/parameter-linking',
  '/blockchain-algorithms',
  '/formula-benefits'
];

pageRoutes.forEach(route => {
  router.get(route, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'public', 'index.html'));
  });
});

// Handle dynamic shape pages
router.get('/shape/:shapeType', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'public', 'index.html'));
});

// Handle category pages
router.get('/category/:category', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'public', 'index.html'));
});

export { router as pageRoutes };
