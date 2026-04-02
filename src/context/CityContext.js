

import { createContext, useEffect, useState } from "react";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(() => {
    return localStorage.getItem("district") || "";
  });

  useEffect(() => {
    if (city) {
      localStorage.setItem("district", city);
    }
  }, [city]);

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};
