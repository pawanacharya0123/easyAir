import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useToken from "../hooks/useToken";
import TokenContext from "../hooks/TokenContext";

const Layout = ({ children }) => {
  const token = useToken();
  return (
    <TokenContext.Provider value={token}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 p-4">{children}</main>
        <Footer />
      </div>
    </TokenContext.Provider>
  );
};

export default Layout;
