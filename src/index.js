import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ลบ .jsx ออก เหลือแค่นี้พอ

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
