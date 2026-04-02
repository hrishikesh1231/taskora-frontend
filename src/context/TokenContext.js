import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState(null);

  const fetchTokens = async () => {
    try {
      const res = await axios.get("https://taskora-backend-aejx.onrender.com/api/tokens/balance", {
        withCredentials: true,
      });
      setTokens(res.data.tokens);
    } catch (err) {
      console.error("Token fetch failed");
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <TokenContext.Provider value={{ tokens, fetchTokens }}>
      {children}
    </TokenContext.Provider>
  );
};
