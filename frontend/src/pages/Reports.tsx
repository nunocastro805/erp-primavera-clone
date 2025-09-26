import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const drawerWidth = 240;

type Summary = {
  totalProducts: number;
  totalInvoices: number;
  totalTransactions: number;
  totalRevenue: number;
};

type ChartData = {
  revenues: number;
  expenses: number;
  profits: number;
  statistics: { name: string; value: number }[];
};

export default function Reports() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [summary, setSummary] = useState<Summary>({ totalProducts: 0, totalInvoices: 0, totalTransactions: 0, totalRevenue: 0 });
  const [chartData, setChartData] = useState<ChartData>({ revenues: 0, expenses: 0, profits: 0, statistics: [] });

  useEffect(() => {
    loadSummary();
    loadChartData();
  }, []);

  async function loadSummary() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/reports/summary', { headers: { Authorization: `Bearer ${token}` } });
    setSummary(res.data);
  }

  async function loadChartData() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/reports/chart-data', { headers: { Authorization: `Bearer ${token}` } });
    setChartData(res.data);
  }

  function logout() {
    localStorage.removeItem('erp_token');
    window.location.href = '/login';
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          { text: 'Produtos', path: '/' },
          { text: 'Financeiro', path: '/finance' },
          { text: 'Faturas', path: '/invoices' },
          { text: 'Relatórios', path: '/reports' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ERP Primavera
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Relatórios
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h5">Total Produtos</Typography>
              <Typography variant="h4">{summary.totalProducts}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h5">Total Faturas</Typography>
              <Typography variant="h4">{summary.totalInvoices}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h5">Total Transações</Typography>
              <Typography variant="h4">{summary.totalTransactions}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h5">Receita Total</Typography>
              <Typography variant="h4">€{summary.totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
          <Paper sx={{ p: 2, minWidth: 400 }}>
            <Typography variant="h6" gutterBottom>Receitas, Despesas e Lucros</Typography>
            <BarChart width={400} height={300} data={[
              { name: 'Receitas', value: chartData.revenues },
              { name: 'Despesas', value: chartData.expenses },
              { name: 'Lucros', value: chartData.profits },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 400 }}>
            <Typography variant="h6" gutterBottom>Estatísticas</Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={chartData.statistics}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statistics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}