

import { createContext, useState } from "react";

export const CountsContext = createContext();

export const CountsProvider = ({ children }) => {
  const [gigCount, setGigCount] = useState(null);
  const [serviceCount, setServiceCount] = useState(null);

  const incrementGig = () => {
    setGigCount((prev) => (prev ?? 0) + 1);
  };

  const decrementGig = () => {
    setGigCount((prev) => Math.max((prev ?? 1) - 1, 0));
  };

  const incrementService = () => {
    setServiceCount((prev) => (prev ?? 0) + 1);
  };

  const decrementService = () => {
    setServiceCount((prev) => Math.max((prev ?? 1) - 1, 0));
  };

  return (
    <CountsContext.Provider
      value={{
        gigCount,
        serviceCount,
        incrementGig,
        decrementGig,
        incrementService,
        decrementService,
        setGigCount,
        setServiceCount
      }}
    >
      {children}
    </CountsContext.Provider>
  );
};