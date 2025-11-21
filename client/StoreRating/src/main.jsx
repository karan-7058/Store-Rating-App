
import ReactDOM from 'react-dom/client'
import MainRouter from "./routes/MainRouter";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={MainRouter} />
  </AuthProvider>
);
