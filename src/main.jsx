import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // <--- เช็คบรรทัดนี้! ต้องมีครับ ไม่งั้น Tailwind ไม่ทำงาน

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)