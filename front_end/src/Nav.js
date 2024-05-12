import './Nav.css';

import { useUser } from './UserContext';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Nav() {
  const { globalUsername, setToken } = useUser();
  const location = useLocation();

  const handleLogout = () => {
    alert(`${globalUsername} is now logged out.`)
    setToken('')
  }

  const isSelected = (path) => {
    return location.pathname === path ? 'underline' : 'none'
  }

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Expenses
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'flex-middle' }}>
                    <Button color="inherit" component={RouterLink} to="/home"
                      sx={{ mx: 1, textDecoration: isSelected('/home'), '&:hover': { textDecoration: 'underline', textDecorationThickness: '2px' }, textDecorationThickness: '3px' }}>Home
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/groups"
                      sx={{ mx: 1, textDecoration: isSelected('/groups'), '&:hover': { textDecoration: 'underline', textDecorationThickness: '2px' }, textDecorationThickness: '3px' }}>Groups
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/reports"
                      sx={{ mx: 1, textDecoration: isSelected('/reports'),  '&:hover': { textDecoration: 'underline', textDecorationThickness: '2px' }, textDecorationThickness: '3px' }}>Reports
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                  <Button
                    variant="outlined" color="secondary" component={RouterLink} to="/login" onClick={handleLogout}
                    sx={{
                      mx: 1,
                      color:'white',
                      borderColor:'white',
                      '&:hover': { backgroundColor: 'white', borderColor: 'rgb(25, 118, 210)', color: 'rgb(25, 118, 210)' }
                    }} > Log out
                  </Button>
                <Typography variant="caption" sx={{ color: 'lightgrey', fontSize: 10 }}>
                  Logged in as {globalUsername}
                </Typography>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
  )
}

export default Nav;
