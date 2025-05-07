import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// TailwindCSSが正しく適用されるようにする
document.documentElement.classList.add('h-full');
document.body.classList.add('h-full');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)