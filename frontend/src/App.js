import React , {useRef} from "react";
import { UserProvider } from "./Components/UserContext";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import "./App.scss";

function App({ children }) {
    const pageRef = useRef(null);

  return (
    <UserProvider> {/* Обернули приложение в UserProvider */}
    <div className="page" ref={pageRef}>
      <Header pageRef={pageRef}  />
      <main className="main">{children}</main>
      <Footer />
    </div>
    </UserProvider>
  );
}

export default App;
