import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import TherapyReport from "./pages/TherapyReport";
import TherapySession from "./pages/TherapySession";
import Recommendations from "./pages/Recommendations";
import Progress from "./pages/Progress";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/therapy-session/:sessionType" element={<TherapySession />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/therapy" element={<TherapyReport />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;