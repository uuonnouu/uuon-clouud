
#!/usr/bin/env node

console.log('🔍 DMENSION API SECRETS VERIFICATION');
console.log('═══════════════════════════════════════');

const requiredSecrets = {
  'DATABASE_URL': {
    description: 'Neon PostgreSQL database connection',
    required: true,
    example: 'postgresql://user:password@host/db?sslmode=require'
  },
  'IBM_QUANTUM_TOKEN': {
    description: 'IBM Quantum Platform API token',
    required: false,
    example: 'your_ibm_quantum_token_here',
    url: 'https://quantum.ibm.com/'
  },
  'IBM_QUANTUM_CRN': {
    description: 'IBM Quantum Cloud Resource Name',
    required: false,
    example: 'crn:v1:bluemix:public:quantum-computing:...'
  },
  'PINATA_JWT': {
    description: 'Pinata IPFS JWT token',
    required: false,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    url: 'https://app.pinata.cloud/developers/api-keys'
  },
  'PINATA_API_KEY': {
    description: 'Pinata IPFS API key (alternative to JWT)',
    required: false,
    example: 'your_pinata_api_key'
  },
  'PINATA_SECRET_API_KEY': {
    description: 'Pinata IPFS secret key (alternative to JWT)',
    required: false,
    example: 'your_pinata_secret_key'
  },
  'WOLFRAM_ALPHA_APP_ID': {
    description: 'Wolfram Alpha API App ID',
    required: false,
    example: 'XXXXXX-XXXXXXXXXX',
    url: 'https://products.wolframalpha.com/api/'
  },
  'THIRDWEB_CLIENT_ID': {
    description: 'Thirdweb Client ID for NFT minting',
    required: false,
    example: 'your_thirdweb_client_id',
    url: 'https://thirdweb.com/dashboard'
  },
  'THIRDWEB_SECRET_KEY': {
    description: 'Thirdweb Secret Key for NFT minting',
    required: false,
    example: 'your_thirdweb_secret_key'
  },
  'UUON_TOKEN_SECRET': {
    description: 'UUON platform token signing secret',
    required: false,
    example: 'your_custom_secret_for_token_signing'
  }
};

console.log('\n📋 SECRETS CONFIGURATION STATUS:');
console.log('─────────────────────────────────────\n');

let configuredCount = 0;
let requiredMissing = 0;
let totalRequired = 0;

for (const [secretName, config] of Object.entries(requiredSecrets)) {
  const isConfigured = !!process.env[secretName];
  const status = isConfigured ? '✅ CONFIGURED' : '❌ MISSING';
  const priority = config.required ? '[REQUIRED]' : '[OPTIONAL]';
  
  if (config.required) totalRequired++;
  if (isConfigured) configuredCount++;
  if (config.required && !isConfigured) requiredMissing++;
  
  console.log(`${status} ${priority} ${secretName}`);
  console.log(`   📝 ${config.description}`);
  
  if (!isConfigured && config.url) {
    console.log(`   🌐 Get it from: ${config.url}`);
  }
  
  if (!isConfigured && config.example) {
    console.log(`   💡 Example: ${config.example}`);
  }
  
  console.log('');
}

console.log('═══════════════════════════════════════');
console.log('📊 SUMMARY:');
console.log(`   • Total Secrets: ${configuredCount}/${Object.keys(requiredSecrets).length} configured`);
console.log(`   • Required Secrets: ${totalRequired - requiredMissing}/${totalRequired} configured`);
console.log(`   • System Status: ${requiredMissing === 0 ? '✅ OPERATIONAL' : '⚠️ DEGRADED'}`);

if (requiredMissing > 0) {
  console.log('\n🚨 CRITICAL: Missing required secrets will cause system failures!');
}

console.log('\n📖 TO ADD SECRETS:');
console.log('1. Open Replit Secrets tab (Tools → Secrets)');
console.log('2. Click "+ New Secret"');
console.log('3. Add the secret name and value');
console.log('4. Restart your application');

console.log('\n🔄 TO TEST CONNECTIVITY:');
console.log('Visit: /api/connectivity/status (after restart)');

console.log('\n═══════════════════════════════════════\n');
