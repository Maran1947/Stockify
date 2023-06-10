import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';


const pages = ['Dashboard', 'Orders', 'Positions', 'Account', 'Tools'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (page) => {
    const pages = {
      dashboard: '/dashboard',
      orders: '/orders',
      positions: '/positions',
      holdings: '/holdings',
      account: '/account',
      tools: '/tools',
    };

    const pagePath = pages[page.toLowerCase()];
    if (pagePath) navigate(pagePath);
  };

  const handleLogout = () => {
    localStorage.removeItem('cmUser');
    navigate('/signin', { replace: true });
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Monoton',
              fontWeight: 500,
              letterSpacing: '.3rem',
              color: '#D43725',
              textDecoration: 'none',
            }}
          >
            Stockify
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Monton',
              fontWeight: 500,
              letterSpacing: '.3rem',
              color: '#D43725',
              textDecoration: 'none',
            }}
          >
            Stockify
          </Typography>
          {
            !['/signup', '/signin'].includes(window.location.pathname) &&
            <>
              <Box sx={{
                flexGrow: 1,
                display: {
                  xs: 'none',
                  md: 'flex',
                  alignItems: 'center',
                  paddingLeft: '2rem'
                }
              }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleNavigate(page)}
                    sx={{
                      my: 2,
                      color: '#000',
                      display: 'block',
                      pl: '1rem',
                      fontWeight: 500
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>

                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="brand"
                  sx={{
                    color: "#fff",
                    border: '2px solid #d4372550',
                    borderRadius: '50px',
                    boxShadow: 'none',
                    fontSize: '1rem!important',
                    padding: '0.2rem 2rem',
                    '&:hover': {
                      boxShadow: 'none',
                      background: 'transparent',
                      color: '#d43725'
                    }
                  }} >Log out</Button>
              </Box>
            </>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;