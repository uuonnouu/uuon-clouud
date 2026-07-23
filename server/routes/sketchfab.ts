import { Router } from 'express';
import FormData from 'form-data';

const router = Router();

const SKETCHFAB_API_URL = 'https://api.sketchfab.com/v3/models';

router.post('/upload', async (req, res) => {
  try {
    const { glbData, name, description, tags, isPrivate } = req.body;

    if (!glbData || !name) {
      return res.status(400).json({ error: 'Missing required fields: glbData and name' });
    }

    const apiToken = process.env.SKETCHFAB_API_TOKEN;
    if (!apiToken) {
      return res.status(500).json({ error: 'Sketchfab API token not configured' });
    }

    const buffer = Buffer.from(glbData, 'base64');

    const formData = new FormData();
    formData.append('token', apiToken);
    formData.append('name', name);
    formData.append('description', description || 'Mathematical visualization exported from Δmension');
    formData.append('tags', tags || 'mathematical,parametric,science,visualization');
    formData.append('isPublished', isPrivate ? 'false' : 'true');
    formData.append('isInspectable', 'true');
    formData.append('modelFile', buffer, {
      filename: `${name}.glb`,
      contentType: 'model/gltf-binary'
    });

    console.log('📤 Uploading to Sketchfab:', { name, size: buffer.length });

    const response = await fetch(SKETCHFAB_API_URL, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Sketchfab upload failed:', result);
      return res.status(response.status).json({ 
        error: 'Sketchfab upload failed', 
        details: result 
      });
    }

    console.log('✅ Sketchfab upload successful:', result);

    res.json({
      success: true,
      uid: result.uid,
      url: `https://sketchfab.com/models/${result.uid}`,
      viewerUrl: result.viewerUrl
    });
  } catch (error) {
    console.error('❌ Sketchfab upload error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
