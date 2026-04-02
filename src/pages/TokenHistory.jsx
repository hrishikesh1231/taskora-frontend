

import React, { useEffect, useState } from "react";
import axios from "axios";

const TokenHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    currentBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "https://taskora-backend-aejx.onrender.com/api/tokens/history",
        { withCredentials: true }
      );

      setTransactions(res.data.transactions);
      setSummary(res.data.summary);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load token history"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={pageStyle}>Loading...</div>;
  if (error) return <div style={pageStyle}>{error}</div>;

  return (
    <div style={pageStyle}>
      <h2>💰 Token Wallet</h2>

      {/* 🔹 Summary Cards */}
      <div style={summaryContainer}>
        <div style={cardStyle}>
          <h4>Total Credit</h4>
          <p style={{ color: "green" }}>+ {summary.totalCredit}</p>
        </div>

        <div style={cardStyle}>
          <h4>Total Debit</h4>
          <p style={{ color: "red" }}>- {summary.totalDebit}</p>
        </div>

        <div style={cardStyle}>
          <h4>Current Balance</h4>
          <p style={{ color: "#ff9800" }}>
            {summary.currentBalance} 🪙
          </p>
        </div>
      </div>

      {/* 🔹 Transactions Table */}
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Gig / Service</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Balance After</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td style={tdStyle}>
                  {tx.type === "credit" ? "🟢 Credit" : "🔴 Debit"}
                </td>

                <td style={tdStyle}>
                  {tx.type === "credit" ? "+" : "-"} {tx.amount}
                </td>

                <td style={tdStyle}>{tx.reason}</td>

                <td style={tdStyle}>
                  {tx.gig?.title ||
                    tx.service?.title ||
                    "-"}
                </td>

                <td style={tdStyle}>
                  {tx.gig
                    ? `${tx.gig.state}, ${tx.gig.district}`
                    : tx.service
                    ? `${tx.service.state}, ${tx.service.district}`
                    : "-"}
                </td>

                <td style={tdStyle}>{tx.balanceAfter}</td>

                <td style={tdStyle}>
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ================== STYLES ================== */

const pageStyle = {
  padding: "40px",
  maxWidth: "1100px",
  margin: "auto",
};

const summaryContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
};

const cardStyle = {
  flex: 1,
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee",
};

export default TokenHistory;