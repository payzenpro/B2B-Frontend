// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { CartProvider } from '../context/CartContext'; 
// //import { index } from "./routes/index.jsx";
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
   
//   <React.StrictMode>
//     {/* <App /> */}
//     <CartProvider>
//     <App />
//   </CartProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
