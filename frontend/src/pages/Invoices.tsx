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
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import api from '../services/api';

const drawerWidth = 240;

type Invoice = { id: string; type: string; customer: string; total: number; items: any[]; createdAt: string };

export default function Invoices() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [type, setType] = useState<'invoice' | 'credit_note' | 'debit_note' | 'receipt'>('invoice');
  const [customer, setCustomer] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQty, setItemQty] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/invoices', { headers: { Authorization: `Bearer ${token}` } });
    setInvoices(res.data);
  }

  async function add() {
    const token = localStorage.getItem('erp_token');
    const items = [{ description: itemDesc, price: Number(itemPrice), qty: Number(itemQty) }];
    await api.post('/invoices', { type, customer, items }, { headers: { Authorization: `Bearer ${token}` } });
    setType('invoice'); setCustomer(''); setItemDesc(''); setItemPrice(''); setItemQty('');
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
          Gestão de Faturas
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Criar Fatura
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Tipo"
              value={type}
              onChange={(e) => setType(e.target.value as 'invoice' | 'credit_note' | 'debit_note' | 'receipt')}
              variant="outlined"
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="invoice">Fatura</MenuItem>
              <MenuItem value="credit_note">Nota de Crédito</MenuItem>
              <MenuItem value="debit_note">Nota de Débito</MenuItem>
              <MenuItem value="receipt">Recibo</MenuItem>
            </TextField>
            <TextField
              label="Cliente"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Descrição Item"
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Preço"
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Quantidade"
              type="number"
              value={itemQty}
              onChange={(e) => setItemQty(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button variant="contained" onClick={add}>
              Criar Fatura
            </Button>
          </Box>
        </Paper>
        <Paper sx={{ height: 400, width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.type === 'invoice' ? 'Fatura' : inv.type === 'credit_note' ? 'Nota Crédito' : inv.type === 'debit_note' ? 'Nota Débito' : 'Recibo'}</TableCell>
                    <TableCell>{inv.customer}</TableCell>
                    <TableCell>€{inv.total.toFixed(2)}</TableCell>
                    <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}