<!DOCTYPE html>  
<html>  
<head>  
  <title>Wallet Checker</title>  
</head>  
<body>  
  <h2>Wallet Checker</h2>  
  
  <input id="address" placeholder="Enter Wallet Address" style="width:300px;">  
  <select id="chain">  
    <option value="ETH">Ethereum</option>  
    <option value="BTC">Bitcoin</option>  
  </select>  
  <button onclick="checkBalance()">Check Balance</button>  
  
  <h3>Result:</h3>  
  <pre id="output"></pre>  
  
<script>  
async function checkBalance() {  
  const address = document.getElementById('address').value;  
  const chain = document.getElementById('chain').value;  
  const response = await fetch('http://localhost:5000/wallet_balance', {  
    method: 'POST',  
    headers: {'Content-Type': 'application/json'},  
    body: JSON.stringify({ address, chain })  
  });  
  const data = await response.json();  
  document.getElementById('output').innerText = JSON.stringify(data, null, 2);  
}  
</script>  
  
</body>  
</html>  
