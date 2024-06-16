import Loading from './Loading.js';
import { useUser } from './UserContext';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignupPage = () => {
	const navigate = useNavigate();
	const { apiURL, setLoading } = useUser();

	const [alertOpen, setAlertOpen] = useState(false)
	const [message, setmessage] = useState('')
	const [severity, setSeverity] = useState('success')

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [secondPassword, setSecondPassword] = useState('');
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [showPassword, setShowPassword] = useState(false);

	const showAlert = (message, severity) => {
		setmessage(message);
		setSeverity(severity);
		setAlertOpen(true);
	}

	const hideAlert = () => {
		setAlertOpen(false)
	}

	const handleSignup = async (event) => {
		event.preventDefault();

		// Validate firstName
		if (!firstName.trim()) {
			showAlert('First Name is required.', 'warning');
			return;
		}

		// Validate lastName
		if (!lastName.trim()) {
			showAlert('Last Name is required.', 'warning');
			return;
		}

		// Validate email
		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			showAlert('Please enter a valid email address.', 'warning');
			return;
		}
		
		// Validate username
		if (!username.trim()) {
			showAlert("Username is required.", 'warning');
			return;
		}
		if (username.length < 3 || username.length > 20) {
			showAlert("Username must be between 3 and 20 characters.", 'warning');
			return;
		}
		
		// Validate password
		if (!password) {
			showAlert("Password is required.", 'warning');
			return;
		}
		if (password.length < 8) {
			showAlert("Password must be at least 8 characters long.", 'warning');
			return;
		}
		if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
			showAlert("Password must contain at least one letter and one number.", 'warning');
			return;
		}
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			showAlert("Password must contain at least one special character (e.g., !, @, #).", 'warning');
			return;
		}

		// Validate passwordMatch
		if (!passwordMatch) {
			showAlert("Passwords do not match.", 'warning');
			return;
		}
		
		setLoading(true)
		try {
			const response = await fetch(`${apiURL}/addUser`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ firstName, lastName, email, username, password })
			})

			const data = await response.json();

			if (response.ok && data.status === "success") {
				navigate('/login');
			}
			else {
				showAlert(data.detail || 'An error occurred during sign up.', 'error');
			}
		}
		catch (error) {
			console.error('Network error:', error);
			showAlert('Network error: Could not connect to server.', 'error');
		}
		finally {
			setLoading(false);
		}
	};

	const handleLogin = (event) => {
		event.preventDefault();
		navigate('/login');
	}

	const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

	const confirmPassword = (event) => {
		let secondPassword = event.target.value;
		setPasswordMatch(secondPassword === password);
		setSecondPassword(secondPassword);
    }

	return (
		<>
			<Container component="main" maxWidth="xs">

				<Paper elevation={10} sx={{ mt: 8, p: 4, borderRadius: 2 }}>

					<Typography component="h1" variant="h5" align='center' sx={{ fontWeight: 'bold' }}>
						Sign up
					</Typography>

					<Box component="form" noValidate sx={{ mt: 1 }}>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="firstName"
							label="First Name"
							name="firstName"
							autoComplete="given-name"
							autoFocus
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
						/>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="lastName"
							label="Last Name"
							name="lastName"
							autoComplete="family-name"
							value={lastName}
							onChange={e => setLastName(e.target.value)}
						/>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email"
							name="email"
							autoComplete="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
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

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type={showPassword ? 'text' : 'password'}
							id="confirmPassword"
							autoComplete="current-confirm-password"
							value={secondPassword}
							onChange={e => confirmPassword(e)}
							error={!passwordMatch}
							helperText={!passwordMatch ? "Passwords do not match" : ""}
							InputProps={{
								style: {
									borderColor: !passwordMatch ? 'red' : undefined,
									borderWidth: !passwordMatch ? 2 : undefined,
								},
								endAdornment: (
									<IconButton onClick={togglePasswordVisibility} edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								)
							}}
						/>

						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSignup}>
							Sign up
						</Button>
						
						<div style={{ textAlign: 'center', fontSize: '14px' }}>
							Already have an account? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleLogin}>Log in</span>
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

export default SignupPage;
