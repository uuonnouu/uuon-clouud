
const { spawn } = require('child_process');
const path = require('path');

console.log('🔧 Running Missing Shape Detector...\n');

// Use tsx to run TypeScript files
const detector = spawn('npx', ['tsx', 'server/missing-shape-detector.ts'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

detector.on('close', (code) => {
  console.log(`\n📊 Missing shape detector exited with code ${code}`);
  
  if (code === 0) {
    console.log('✅ Analysis complete - check missing-shapes-report.json for results');
  } else {
    console.error('❌ Analysis failed - check error messages above');
  }
});

detector.on('error', (err) => {
  console.error('❌ Failed to start missing shape detector:', err.message);
  console.log('\n💡 Make sure tsx is installed: npm install tsx');
});
