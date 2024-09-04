import {BrowserRouter} from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContextProvider from './contextApi/userAuthContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
   <div className="main bg-[#cccccc] min-h-screen">
      <App />
      <ToastContainer />
    </div>

    </UserContextProvider>
  </BrowserRouter>,
)
