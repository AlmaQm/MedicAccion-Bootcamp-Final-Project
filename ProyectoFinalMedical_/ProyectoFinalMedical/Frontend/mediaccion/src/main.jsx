import React from 'react'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MedProvider } from "./context/MedContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MedProvider>
      <BrowserRouter>
        <ToastContainer />
        <App />
      </BrowserRouter>
    </MedProvider>
  </React.StrictMode>,
)
