import { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css'
import AuthPage from "./Page/AuthPage.jsx";
import Home from "./Page/Home.jsx";

function App() {

  return (
    <>
        <BrowserRouter>
      <Routes>
          <Route index element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />

      </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
