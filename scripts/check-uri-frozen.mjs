import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const CONTRACT_ADDRESS = '0xa14c3015E6b9Ad30337bD72c94Dc236835f61165';
const ABI = ['function uriFrozen() view returns (bool)'];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

const frozen = await contract.uriFrozen();
console.log('uriFrozen():', frozen);