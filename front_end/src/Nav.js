import './Nav.css';

import { useUser } from './UserContext';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Nav() {
  const { globalUsername, setGlobalUsername } = useUser();

  const handleLogout = () => {
    setGlobalUsername('')
    alert(`${globalUsername} is now logged out.`)
  }

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Expenses
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'flex-middle' }}>
                    <Button color="inherit" component={RouterLink} to="/home" sx={{ mx: 1 }}>Home</Button>
                    <Button color="inherit" component={RouterLink} to="/reports" sx={{ mx: 1 }}>Reports</Button>
                </Box>
                <Button color="inherit" component={RouterLink} to="/login" sx={{ mx: 1 }} onClick={handleLogout}>Log out</Button>
            </Toolbar>
        </Container>
    </AppBar>
  )
}

export default Nav;
