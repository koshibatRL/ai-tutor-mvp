import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="flex justify-center items-center min-h-screen">
            <Link to="/learn" className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Lesson 1: Fractions
            </Link>
          </div>
        } />
        <Route path="/learn" element={<div className="p-8">Learning content goes here</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
