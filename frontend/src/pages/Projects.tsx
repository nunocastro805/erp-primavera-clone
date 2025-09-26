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

type Project = { id: string; name: string; budget: number; deadline: string; expenses: number; status: string };

export default function Projects() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/projects', { headers: { Authorization: `Bearer ${token}` } });
    setProjects(res.data);
  }

  async function add() {
    const token = localStorage.getItem('erp_token');
    await api.post('/projects', { name, budget: Number(budget), deadline }, { headers: { Authorization: `Bearer ${token}` } });
    setName(''); setBudget(''); setDeadline('');
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
          { text: 'Clientes', path: '/customers' },
          { text: 'Fornecedores', path: '/suppliers' },
          { text: 'Funcionários', path: '/employees' },
          { text: 'Projetos', path: '/projects' },
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
          Gestão de Projetos
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Adicionar Projeto
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Orçamento"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Prazo"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={add}>
              Adicionar
            </Button>
          </Box>
        </Paper>
        <Paper sx={{ height: 400, width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Orçamento</TableCell>
                  <TableCell>Despesas</TableCell>
                  <TableCell>Prazo</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>€{p.budget.toFixed(2)}</TableCell>
                    <TableCell>€{p.expenses.toFixed(2)}</TableCell>
                    <TableCell>{p.deadline}</TableCell>
                    <TableCell>{p.status}</TableCell>
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