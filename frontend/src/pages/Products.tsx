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
  TextField,
  Button,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type Product = { id: string; name: string; price: number; stock: number };

const drawerWidth = 240;

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/products', { headers: { Authorization: `Bearer ${token}` } });
    setProducts(res.data);
  }

  async function add() {
    const token = localStorage.getItem('erp_token');
    await api.post('/products', { name, price: Number(price), stock: Number(stock) }, { headers: { Authorization: `Bearer ${token}` } });
    setName(''); setPrice(''); setStock('');
    load();
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

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', width: 200 },
    { field: 'price', headerName: 'Preço', width: 150, type: 'number' },
    { field: 'stock', headerName: 'Stock', width: 150, type: 'number' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          { text: 'Produtos', path: '/' },
          { text: 'Financeiro', path: '/finance' },
          { text: 'Faturas', path: '/invoices' },
          { text: 'Relatórios', path: '/reports' },
          { text: 'Clientes', path: '/customers' },
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
            keepMounted: true, // Better open performance on mobile.
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
          Gestão de Produtos
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Adicionar Produto
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Preço"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button variant="contained" onClick={add}>
              Adicionar
            </Button>
          </Box>
        </Paper>
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Paper>
      </Box>
    </Box>
  );
}
