import './styles.scss';

import { useUser } from './../../UserContext';

import { Link, useLocation } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';

const Nav = ({ username }) => {
  const { setToken } = useUser();
  const location = useLocation();

  const handleLogout = () => {
    alert(`${username} is now logged out.`)
    setToken('')
  }

  const isSelected = (path) => {
    return location.pathname === path ? 'underline' : 'none'
  }

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Container maxWidth={false} sx={{ width: '100%' }}>
            <Toolbar disableGutters>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Expenses
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'flex-middle' }}>
                  <Button color="inherit" component={Link} to={`/home/${username}`}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        mx: 1,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor: 'currentColor',
                          transform: isSelected('/home') === 'underline' ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'bottom left',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                          height: '2px',
                        },
                      }}
                    >
                      <HomeIcon sx={{ fontSize: '20px', mr: 1 }} />
                      Home
                    </Button>
                    <Button color="inherit" component={Link} to={`/groups/${username}`}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        mx: 1,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor: 'currentColor',
                          transform: isSelected('/groups') === 'underline' ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'bottom left',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                          height: '2px',
                        },
                      }}
                    >
                      <GroupsIcon sx={{ fontSize: '20px', mr: 1 }} />
                      Groups
                    </Button>
                    <Button color="inherit" component={Link} to={`/reports/${username}`}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        mx: 1,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor: 'currentColor',
                          transform: isSelected('/reports') === 'underline' ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'bottom left',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                          height: '2px',
                        },
                      }}
                    >
                      <BarChartIcon sx={{ fontSize: '20px', mr: 1 }} />
                      Reports
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                  <Button
                    variant="outlined" color="secondary" component={Link} to="/login" onClick={handleLogout}
                    sx={{
                      mx: 1,
                      color:'white',
                      borderColor:'white',
                      '&:hover': { backgroundColor: 'white', borderColor: 'rgb(25, 118, 210)', color: 'rgb(25, 118, 210)' }
                    }} > Log out
                  </Button>
                <Typography variant="caption" sx={{ color: 'lightgrey', fontSize: 10 }}>
                  Logged in as {username}
                </Typography>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
  )
}

export default Nav;
