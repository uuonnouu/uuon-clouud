# BusinessUUallet  
  
// Currently in routes.ts:  
const BUSINESS_WALLET_ADDRESS = process.env.BUSINESS_WALLET_ADDRESS || "0x14791697260E4c9A71f18484C9f997B308e59325";  
  
  
  
As Vum Wallet Backend  
  
// AE VUM FINAL WALLET BACKEND — REAL ON-CHAIN ONLY  
const express = require('express');  
const cors = require('cors');  
const { ethers } = require('ethers');  
require('dotenv').config();  
  
const app = express();  
app.use(cors());  
app.use(express.json());  
  
const PORT = 5001;  
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);  
const wallet = new ethers.Wallet(process.env.BUSINESS_WALLET_KEY, provider);  
  
const PIEZ_TOKEN_ADDRESS = "0x24Dd4d8B6B763A83064C86a4A38891E96ED77206"; // Live PIEZ on Polygon  
const PIEZ_ABI = [  
  "function balanceOf(address) view returns (uint256)",  
  "function transfer(address,uint256) returns (bool)"  
];  
const piez = new ethers.Contract(PIEZ_TOKEN_ADDRESS, PIEZ_ABI, wallet);  
  
app.get('/wallet/balance', async (req, res) => {  
  try {  
    const ethBal = await provider.getBalance(wallet.address);  
    const piezBal = await piez.balanceOf(wallet.address);  
    res.json({  
      address: wallet.address,  
      eth: ethers.utils.formatEther(ethBal),  
      piez: ethers.utils.formatUnits(piezBal, 18)  
    });  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
});  
  
app.post('/transfer', async (req, res) => {  
  const { to, amount, token } = req.body;  
  try {  
    if (token === 'ETH') {  
      const tx = await wallet.sendTransaction({  
        to,  
        value: ethers.utils.parseEther(amount)  
      });  
      await tx.wait();  
      return res.json({ status: 'success', txHash: tx.hash });  
    } else if (token === 'PIEZ') {  
      const tx = await piez.transfer(to, ethers.utils.parseUnits(amount, 18));  
      await tx.wait();  
      return res.json({ status: 'success', txHash: tx.hash });  
    } else {  
      return res.status(400).json({ error: 'Invalid token selected' });  
    }  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
});  
  
app.listen(PORT, () => {  
  console.log(`AEVUM backend LIVE — Wallet: ${wallet.address}`);  
});  
