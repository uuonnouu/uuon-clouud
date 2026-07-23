import { pinataService } from '../server/services/pinataService.js';

const ok = await pinataService.testAuthentication();
console.log('Pinata auth valid:', ok);