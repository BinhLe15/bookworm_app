import React, { useState } from 'react'
import './App.css'

// import { AuthProvider } from './provider/AuthProvider'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './provider/AuthProvider'
import Home from './pages/Home'

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
