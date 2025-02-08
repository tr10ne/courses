import React, { useRef } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer/Footer";
import "./App.scss";

function App({ children }) {
  const pageRef = useRef(null);

  return (
    <div className="page" ref={pageRef}>
      <Header pageRef={pageRef}  />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}

export default App;