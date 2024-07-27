import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContextProvider.tsx'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppContextProvider>
    <BrowserRouter>
      <App />
      <Toaster richColors position='top-center' />

    </BrowserRouter>,
  </AppContextProvider>
)
