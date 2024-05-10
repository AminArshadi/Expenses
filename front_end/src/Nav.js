import './Nav.css';

import { useUser } from './UserContext';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Nav() {
  const { globalUsername, setGlobalUsername } = useUser();
  const location = useLocation();

  const handleLogout = () => {
    setGlobalUsername('')
    alert(`${globalUsername} is now logged out.`)
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
                    <Button color="inherit" component={RouterLink} to="/home" sx={{ mx: 1, textDecoration: isSelected('/home') }}>Home</Button>
                    <Button color="inherit" component={RouterLink} to="/groups" sx={{ mx: 1, textDecoration: isSelected('/groups') }}>Groups</Button>
                    <Button color="inherit" component={RouterLink} to="/reports" sx={{ mx: 1, textDecoration: isSelected('/reports') }}>Reports</Button>
                </Box>
                <Button variant="outlined" color="secondary" component={RouterLink} to="/login" sx={{ mx: 1, color:'white', borderColor:'white', '&:hover': { backgroundColor: 'white', borderColor: 'rgb(25, 118, 210)', color: 'rgb(25, 118, 210)' } }} onClick={handleLogout}>Log out</Button>
            </Toolbar>
        </Container>
    </AppBar>
  )
}

export default Nav;
