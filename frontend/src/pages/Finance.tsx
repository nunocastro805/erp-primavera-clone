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
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import api from '../services/api';

const drawerWidth = 240;

type Transaction = { id: string; description: string; amount: number; type: 'income' | 'expense'; date: string };
type Balance = { balance: number; income: number; expense: number };
type Account = { id: string; code: string; name: string; class: string; type: string };

export default function Finance() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({ balance: 0, income: 0, expense: 0 });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [tabValue, setTabValue] = useState(0);
  const [statements, setStatements] = useState<any>({});

  useEffect(() => {
    loadTransactions();
    loadBalance();
    loadAccounts();
  }, []);

  async function loadTransactions() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/finance/transactions', { headers: { Authorization: `Bearer ${token}` } });
    setTransactions(res.data);
  }

  async function loadBalance() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/finance/balance', { headers: { Authorization: `Bearer ${token}` } });
    setBalance(res.data);
  }

  async function loadAccounts() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/accounts', { headers: { Authorization: `Bearer ${token}` } });
    setAccounts(res.data);
  }

  async function addTransaction() {
    const token = localStorage.getItem('erp_token');
    await api.post('/finance/transactions', { description, amount: Number(amount), type }, { headers: { Authorization: `Bearer ${token}` } });
    setDescription(''); setAmount(''); setType('income');
    loadTransactions();
    loadBalance();
  }

  async function loadStatements() {
    const token = localStorage.getItem('erp_token');
    const res = await api.get('/finance/statements', { headers: { Authorization: `Bearer ${token}` } });
    setStatements(res.data);
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
          Módulo Financeiro
        </Typography>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label="Transações" />
          <Tab label="Plano de Contas" />
          <Tab label="Demonstrações" />
        </Tabs>
        {tabValue === 0 && (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Balanço Atual</Typography>
              <Typography>Saldo: €{balance.balance.toFixed(2)}</Typography>
              <Typography>Receitas: €{balance.income.toFixed(2)}</Typography>
              <Typography>Despesas: €{balance.expense.toFixed(2)}</Typography>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar Transação
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Valor"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  select
                  label="Tipo"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="income">Receita</MenuItem>
                  <MenuItem value="expense">Despesa</MenuItem>
                </TextField>
                <Button variant="contained" onClick={addTransaction}>
                  Adicionar
                </Button>
              </Box>
            </Paper>
            <Paper sx={{ height: 400, width: '100%' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>€{t.amount.toFixed(2)}</TableCell>
                        <TableCell>{t.type === 'income' ? 'Receita' : 'Despesa'}</TableCell>
                        <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
        {tabValue === 1 && (
          <Paper sx={{ height: 400, width: '100%' }}>
            <Typography variant="h6" gutterBottom>Plano de Contas</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Classe</TableCell>
                    <TableCell>Tipo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.code}</TableCell>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.class}</TableCell>
                      <TableCell>{a.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        {tabValue === 2 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Demonstrações Financeiras</Typography>
            <Button onClick={loadStatements} variant="contained" sx={{ mb: 2 }}>Carregar Demonstrações</Button>
            {statements.balanceSheet && (
              <>
                <Typography variant="h6">Balanço</Typography>
                <Typography>Ativos: €{statements.balanceSheet.assets.cash.toFixed(2)}</Typography>
                <Typography>Passivos: €{statements.balanceSheet.liabilities.loans.toFixed(2)}</Typography>
                <Typography>Capital Próprio: €{statements.balanceSheet.equity.retainedEarnings.toFixed(2)}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Demonstração de Resultados</Typography>
                <Typography>Receitas: €{statements.incomeStatement.revenues.toFixed(2)}</Typography>
                <Typography>Despesas: €{statements.incomeStatement.expenses.toFixed(2)}</Typography>
                <Typography>Lucro Líquido: €{statements.incomeStatement.netProfit.toFixed(2)}</Typography>
              </>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
}