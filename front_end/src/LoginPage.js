import { useUser } from './UserContext';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function LoginPage() {
  const navigate = useNavigate();
  const { setGlobalUsername, apiURL } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Validate username
    if (!username.trim()) {
      alert("Username is required.");
      return;
    }
  
    // Validate password
    if (!password) {
      alert("Password is required.");
      return;
    }
    
    try {
      const response = await fetch(`${apiURL}/verifyCredentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
          setGlobalUsername(username);
          navigate('/home');
      }
      else {
          alert(data.detail || 'An error occurred during login.');
      }
    }
    catch (error) {
        alert('Network error: Could not connect to server.');
    }
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    setGlobalUsername('');
    navigate('/signup');
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            Log in
        </Typography>

        <Box component="form" noValidate sx={{ mt: 1 }}>

          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
            Log In
          </Button>
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
              Don't have an account? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleSignUp}>Sign Up</span>
          </div>

        </Box>

      </Box>
    </Container>
  )
}

export default LoginPage;
