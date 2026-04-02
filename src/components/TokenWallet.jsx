import { useEffect, useState } from "react";
import axios from "axios";
import "./TokenWallet.css";

const TokenWallet = ({ onClose }) => {
  const [tokens, setTokens] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const [bal, hist] = await Promise.all([
      axios.get("https://taskora-backend-aejx.onrender.com/api/tokens/balance", { withCredentials: true }),
      axios.get("https://taskora-backend-aejx.onrender.com/api/tokens/history", { withCredentials: true }),
    ]);

    setTokens(bal.data.tokens);
    setHistory(hist.data || []);
  };

  return (
    <div className="wallet-backdrop">
      <div className="wallet-card">
        <h5>🪙 Token Wallet</h5>

        <div className="wallet-balance">
          Balance: <strong>{tokens}</strong>
        </div>

        <button className="topup-btn" disabled>
          Top-Up (Coming Soon)
        </button>

        <hr />

        <h6>History</h6>
        <div className="wallet-history">
          {history.length === 0 ? (
            <p className="text-muted">No transactions</p>
          ) : (
            history.map((t) => (
              <div key={t._id} className={`tx ${t.type}`}>
                <span>{t.reason}</span>
                <span>
                  {t.type === "credit" ? "+" : "-"}
                  {t.amount}
                </span>
              </div>
            ))
          )}
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TokenWallet;
