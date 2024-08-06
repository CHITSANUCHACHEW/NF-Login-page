import React from "react";
import "./App.css";
import Login from "./component/Login";
import UserPage from "./component/userPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div className="container">
        <img src="../../../public/image/Bg.jpg" alt="" className="bg-img" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/page" element={<UserPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
