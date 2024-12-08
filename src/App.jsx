import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import LandingPage from "./components/LandingPage/LandingPage";

function test() {
  return (
    <>
      <Sidebar />
      <Main />
    </>
  );
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={test()} />
        <Route
          path="/app"
          element={
            <>
              <Sidebar />
              <Main />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
