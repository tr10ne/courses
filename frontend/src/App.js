import React from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer/Footer";
import "./App.scss";

function App({ children }) {
  return (
    <div className="page">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}

export default App;
