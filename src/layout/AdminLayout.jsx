
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [activePage, setActivePage] = useState('الرئيسية');
  const [open, setOpen] = useState(!isSmallScreen);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  // يخلي السايدبار يتأقلم مع حجم الشاشة
  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const menuItems = [
    { text: 'الرئيسية', icon: <DashboardIcon />, path: '/Admin' },
    { text: 'المستخدمين', icon: <PeopleIcon />, path: '/Admin/users' },
  ];

  const handleMenuClick = (option) => {
    if (option === 'تسجيل الخروج') {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }

    if (option === 'الحساب الشخصي') {
      setActivePage('الحساب الشخصي');
      navigate('/Admin/profile');
      if (isSmallScreen) setOpen(false);
    }

    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* ================= Sidebar ================= */}
      <Box
        sx={{
          width: open ? 220 : 60,
          backgroundColor: '#6a6a57',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          transition: 'width 0.3s, left 0.3s',
          position: isSmallScreen ? 'fixed' : 'relative',
          left: isSmallScreen ? (open ? 0 : -220) : 0,
          top: 0,
          zIndex: 1200,
          minHeight: '100vh',
        }}
      >
        {open && (
          <>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}
            >
              لوحة الإدارة
            </Typography>

            <Divider
              sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 2 }}
            />
          </>
        )}

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ mb: 1, borderRadius: 1 }}
            >
              <Tooltip
                title={!open ? item.text : ''}
                placement="left"
              >
                <ListItemButton
                  onClick={() => {
                    setActivePage(item.text);
                    navigate(item.path);
                    if (isSmallScreen) setOpen(false);
                  }}
                  sx={{
                    justifyContent: open
                      ? 'flex-start'
                      : 'center',
                    bgcolor:
                      activePage === item.text
                        ? 'rgba(255,255,255,0.2)'
                        : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                    },
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'white',
                      minWidth: 0,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.text}
                      sx={{ ml: 2 }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* ================= Main Content ================= */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* ================= Navbar ================= */}
        <AppBar
          position="static"
          sx={{ backgroundColor: '#6a6a57' }}
        >
          <Toolbar>
            {/* زر فتح السايدبار */}
            <IconButton
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>

            {/* اسم الصفحة */}
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, mr: 2 }}
            >
              {activePage}
            </Typography>

            {/* اسم الدار */}
<Box
  sx={{
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    gap: 1,
    pointerEvents: 'none',   // مهم عشان ما يأثر على المنيو
    textAlign: 'center',
  }}
>
  <ElderlyWomanIcon fontSize="large" sx={{ pointerEvents: 'auto' }} />

  <Typography
    variant="h6"
    sx={{
      whiteSpace: 'nowrap',   // يمنع نزول النص سطر ثاني
      pointerEvents: 'auto',
    }}
  >
    دار المحبة والوئام للمسنين
  </Typography>
</Box>


            {/* الحساب */}
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>

            {/* القائمة */}
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() =>
                  handleMenuClick('الحساب الشخصي')
                }
              >
                الحساب الشخصي
              </MenuItem>

              <MenuItem
                onClick={() =>
                  handleMenuClick('تسجيل الخروج')
                }
              >
                تسجيل الخروج
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* ================= Page Content ================= */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            backgroundColor: '#f0f0ea',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

