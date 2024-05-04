import { useNavigate } from 'react-router-dom';
import './Nav.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container } from '@mui/material';

function Nav() {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    navigate('/login');
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
                <Button color="inherit" component={RouterLink} to="/home" sx={{ mx: 1 }} onClick={handleLogout}>Log out</Button>
            </Toolbar>
        </Container>
    </AppBar>
  )
}

export default Nav;
