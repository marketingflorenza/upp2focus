import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // 

// สร้าง Root เพื่อเชื่อมต่อกับ <div id="root"> ในไฟล์ index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// สั่งให้ React เริ่มวาดหน้าจอ
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


