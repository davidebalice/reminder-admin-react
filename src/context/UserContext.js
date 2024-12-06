import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

export function UserProvider({ children }) {
  const token = localStorage.getItem("authToken");
  const [userData, setUserData] = useState(null);
  const [demo, setDemo] = useState(false);

  const login = (userData) => {
    setUserData(userData);
  };

  const logout = () => {
    setUserData(null);
  };

  useEffect(() => {
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + "/api/get/user",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setUserData(response.data.user);
        setDemo(response.data.demo === "false" ? false : true);
      })
      .catch((error) => {
        console.error("Error calling api:", error);
      });
  }, [token]);

  return (
    <Context.Provider
      value={{
        userData,
        setUserData,
        login,
        logout,
        demo,
      }}
    >
      {children}
    </Context.Provider>
  );
}
