import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContextProvider.tsx'
import { ToastContainer } from "react-toastify"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppContextProvider>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>,
  </AppContextProvider>
)
