import Loading from './Loading.js';
import { useUser } from './UserContext';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function SignupPage() {
	const navigate = useNavigate();
	const { apiURL, setLoading } = useUser();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [secondPassword, setSecondPassword] = useState('');
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [showPassword, setShowPassword] = useState(false);

	const handleSignup = async (event) => {
		event.preventDefault();

		// Validate firstName
		if (!firstName.trim()) {
			alert('First Name is required.');
			return;
		}

		// Validate lastName
		if (!lastName.trim()) {
			alert('Last Name is required.');
			return;
		}

		// Validate email
		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			alert('Please enter a valid email address.');
			return;
		}
		
		// Validate username
		if (!username.trim()) {
			alert("Username is required.");
			return;
		}
		if (username.length < 3 || username.length > 20) {
			alert("Username must be between 3 and 20 characters.");
			return;
		}
		
		// Validate password
		if (!password) {
			alert("Password is required.");
			return;
		}
		if (password.length < 8) {
			alert("Password must be at least 8 characters long.");
			return;
		}
		if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
			alert("Password must contain at least one letter and one number.");
			return;
		}
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			alert("Password must contain at least one special character (e.g., !, @, #).");
			return;
		}

		// Validate passwordMatch
		if (!passwordMatch) {
			alert("Passwords do not match.");
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
				alert(data.detail || 'An error occurred during sign up.');
			}
		}
		catch (error) {
			console.error('Network error:', error);
			alert('Network error: Could not connect to server.');
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
			<Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

				<Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
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
			</Box>
			</Container>

			<Loading />
		</>
	)
}

export default SignupPage;
