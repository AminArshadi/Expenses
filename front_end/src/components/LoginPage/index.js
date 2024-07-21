import Loading from './../../sharedComponents/Loading'
import { useUser } from './../../UserContext'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, TextField, Button, Typography, Box, IconButton, Paper, Snackbar, Alert } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const LoginPage = () => {
  const navigate = useNavigate()
  const { setToken, apiURL, setLoading } = useUser()

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setToken('')
  }, [])

  const showAlert = (message, severity) => {
    setMessage(message)
    setSeverity(severity)
    setAlertOpen(true)
  }

  const hideAlert = () => {
    setAlertOpen(false)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
  
    // Validate username
    if (!username.trim()) {
      showAlert("Username is required.", 'warning')
      return
    }
  
    // Validate password
    if (!password) {
      showAlert("Password is required.", 'warning')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`${apiURL}/verifyCredentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        setToken(data.token)
        navigate(`/home/${username}`)
      }
      else {
        showAlert(data.detail || 'An error occurred during login.', 'error')
      }
    }
    catch (error) {
      showAlert('Network error: Could not connect to server.', 'error')
    }
    finally {
			setLoading(false)
		}
  }

  const handleSignUp = (event) => {
    event.preventDefault()
    navigate('/signup')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Container component="main" maxWidth="sm">

        <Paper elevation={10} sx={{ mt: 8, p: 4, borderRadius: 2 }}>

          <Typography component="h1" variant="h5" align='center' sx={{ fontWeight: 'bold' }}>
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

        </Paper>

      </Container>

      <Loading />

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={hideAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={hideAlert} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default LoginPage
