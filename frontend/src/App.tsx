import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Products from './pages/Products';
import Finance from './pages/Finance';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Employees from './pages/Employees';
import Projects from './pages/Projects';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('erp_token');
  return token ? children : <Navigate to='/login' />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path='/finance' element={<PrivateRoute><Finance /></PrivateRoute>} />
          <Route path='/invoices' element={<PrivateRoute><Invoices /></PrivateRoute>} />
          <Route path='/reports' element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path='/customers' element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path='/suppliers' element={<PrivateRoute><Suppliers /></PrivateRoute>} />
          <Route path='/employees' element={<PrivateRoute><Employees /></PrivateRoute>} />
          <Route path='/projects' element={<PrivateRoute><Projects /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
