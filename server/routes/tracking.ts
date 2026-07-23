import { Router } from 'express';
import { neon } from '@neondatabase/serverless';

const router = Router();

const sql = neon(process.env.DATABASE_URL!);

// Track shape view
router.post('/view', async (req, res) => {
  try {
    const { shapeType, parameters, sessionId } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    
    await sql`
      INSERT INTO shape_viewing_history (shape_type, parameters, session_id, user_agent)
      VALUES (${shapeType}, ${JSON.stringify(parameters)}::jsonb, ${sessionId}, ${userAgent})
    `;
    
    res.json({ success: true, message: 'View tracked' });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ success: false, error: 'Failed to track view' });
  }
});

// Track parameter change
router.post('/parameter-change', async (req, res) => {
  try {
    const { shapeType, parameterName, oldValue, newValue, sessionId } = req.body;
    
    await sql`
      INSERT INTO parameter_change_log (shape_type, parameter_name, old_value, new_value, session_id)
      VALUES (${shapeType}, ${parameterName}, ${JSON.stringify(oldValue)}::jsonb, ${JSON.stringify(newValue)}::jsonb, ${sessionId})
    `;
    
    res.json({ success: true, message: 'Parameter change tracked' });
  } catch (error) {
    console.error('Error tracking parameter change:', error);
    res.status(500).json({ success: false, error: 'Failed to track parameter change' });
  }
});

// Log export
router.post('/export', async (req, res) => {
  try {
    const { 
      shapeId, 
      exportType, 
      parameters, 
      dynamicsEmbedded, 
      materialSettings,
      exportResolution,
      fileSizeBytes
    } = req.body;
    
    await sql`
      INSERT INTO export_preservation_records (
        shape_id, 
        export_type, 
        parameters_used, 
        dynamics_embedded, 
        material_settings,
        export_resolution,
        file_size_bytes,
        export_timestamp
      )
      VALUES (
        ${shapeId}, 
        ${exportType}, 
        ${JSON.stringify(parameters)}::jsonb, 
        ${JSON.stringify(dynamicsEmbedded || {})}::jsonb, 
        ${JSON.stringify(materialSettings || {})}::jsonb,
        ${exportResolution || 'standard'},
        ${fileSizeBytes || 0},
        NOW()
      )
    `;
    
    res.json({ success: true, message: 'Export logged' });
  } catch (error) {
    console.error('Error logging export:', error);
    res.status(500).json({ success: false, error: 'Failed to log export' });
  }
});

// Get tracking stats
router.get('/stats', async (req, res) => {
  try {
    const [viewCount] = await sql`SELECT COUNT(*) as count FROM shape_viewing_history`;
    const [exportCount] = await sql`SELECT COUNT(*) as count FROM export_preservation_records`;
    const [paramChangeCount] = await sql`SELECT COUNT(*) as count FROM parameter_change_log`;
    
    const topShapes = await sql`
      SELECT shape_type, COUNT(*) as view_count 
      FROM shape_viewing_history 
      GROUP BY shape_type 
      ORDER BY view_count DESC 
      LIMIT 10
    `;
    
    const recentExports = await sql`
      SELECT shape_id, export_type, export_timestamp 
      FROM export_preservation_records 
      ORDER BY export_timestamp DESC 
      LIMIT 10
    `;
    
    res.json({
      success: true,
      stats: {
        totalViews: viewCount.count,
        totalExports: exportCount.count,
        totalParameterChanges: paramChangeCount.count,
        topShapes,
        recentExports
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

// Batch tracking endpoint for bulk interaction recording
router.post('/batch', async (req, res) => {
  try {
    const { events, sessionId, timestamp } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.json({ 
        success: true, 
        message: 'No events to process',
        processed: 0 
      });
    }
    
    let processedCount = 0;
    
    for (const event of events.slice(0, 100)) { // Limit to 100 events per batch
      try {
        if (event.type === 'view' && event.shapeType) {
          await sql`
            INSERT INTO shape_viewing_history (shape_type, parameters, session_id, user_agent)
            VALUES (${event.shapeType}, ${JSON.stringify(event.parameters || {})}::jsonb, ${sessionId || 'batch'}, 'batch_import')
          `;
          processedCount++;
        }
      } catch (eventError) {
        // Skip individual event errors, continue with batch
        console.warn('Batch event error:', eventError);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Batch processed',
      processed: processedCount,
      total: events.length
    });
  } catch (error) {
    console.error('Error processing batch:', error);
    res.status(500).json({ success: false, error: 'Failed to process batch' });
  }
});

export default router;
