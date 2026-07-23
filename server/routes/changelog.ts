
import { Router } from 'express';
import { changelogTracker } from '../changelog-tracker';

const router = Router();

router.post('/log-change', async (req, res) => {
  try {
    const { version, category, component, description, files, impact } = req.body;
    
    await changelogTracker.logChange({
      version: version || 'auto',
      category,
      component,
      description,
      files: files || [],
      impact: impact || 'medium'
    });

    res.json({ success: true, message: 'Change logged successfully' });
  } catch (error) {
    console.error('❌ Error logging change:', error);
    res.status(500).json({ success: false, error: 'Failed to log change' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const report = await changelogTracker.generateSystemReport();
    res.json({ success: true, report });
  } catch (error) {
    console.error('❌ Error generating changelog report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

router.get('/export', async (req, res) => {
  try {
    const data = await changelogTracker.exportChangelogData();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="changelog-export.json"');
    res.send(data);
  } catch (error) {
    console.error('❌ Error exporting changelog:', error);
    res.status(500).json({ success: false, error: 'Failed to export changelog' });
  }
});

export default router;
