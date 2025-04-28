import { useState } from "react";
import axios from "axios";
import './App.css';

const COVALENT_API_KEY = "cqt_rQTJy7mvvBRkrBc7VwmjTG8yXMYD";

const chainIds = {
  ethereum: 1,
  polygon: 137,
  bsc: 56,
  base_mainnet: 8453,
  optimism: 10,
  arbitrum: 42161
};

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!walletAddress) return alert("Please enter a wallet address");

    setLoading(true);
    const allTokens = [];

    const promises = Object.entries(chainIds).map(async ([chainName, chainId]) => {
      try {
        const url = `https://api.covalenthq.com/v1/${chainId}/address/${walletAddress}/balances_v2/?key=${COVALENT_API_KEY}`;
        const res = await axios.get(url);
        const tokenList = res.data.data.items;

        tokenList.forEach(token => {
          const balance = Number(token.balance) / Math.pow(10, token.contract_decimals);
          const price = token.quote_rate || 0;
          const usdValue = balance * price;

          if (balance > 0 && usdValue > 0) {
            allTokens.push({
              chain: chainName.toUpperCase(),
              symbol: token.contract_ticker_symbol,
              balance: balance.toFixed(4),
              usdValue: usdValue.toFixed(2)
            });
          }
        });
      } catch (err) {
        const promises = Object.entries(chainIds).map(async ([chainName, chainId]) => {
          try {
            const url = `https://api.covalenthq.com/v1/${chainId}/address/${walletAddress}/balances_v2/?key=${COVALENT_API_KEY}`;
            const res = await axios.get(url);
            const tokenList = res.data.data.items;
        
            tokenList.forEach(token => {
              const balance = Number(token.balance) / Math.pow(10, token.contract_decimals);
              const price = token.quote_rate || 0;
              const usdValue = balance * price;
        
              if (balance > 0 && usdValue > 0) {
                allTokens.push({
                  chain: chainName.toUpperCase(),
                  symbol: token.contract_ticker_symbol,
                  balance: balance.toFixed(4),
                  usdValue: usdValue.toFixed(2)
                });
              }
            });
          } catch (err) {
            console.error(`Error fetching from ${chainName}:`, err.message);
            alert(`Error fetching from ${chainName}: ${err.message}`);
          }
        });
        
      }
    });

    await Promise.all(promises);

    console.log(allTokens);
    setTokens(allTokens);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Wallet Token Scanner</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
          style={{ padding: "10px", width: "400px", marginRight: "10px" }}
        />
        <button
          onClick={handleScan}
          style={{ padding: "10px 20px", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan Wallet"}
        </button>
      </div>

      {tokens.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Chain</th>
              <th style={thStyle}>Token</th>
              <th style={thStyle}>Balance</th>
              <th style={thStyle}>Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td style={tdStyle}>{token.chain}</td>
                <td style={tdStyle}>{token.symbol}</td>
                <td style={tdStyle}>{token.balance}</td>
                <td style={tdStyle}>${token.usdValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px",
  borderBottom: "2px solid #ccc",
  textAlign: "left"
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee"
};

export default App;
