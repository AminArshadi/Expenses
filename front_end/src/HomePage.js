import Nav from './Nav.js';
import { useUser } from './UserContext';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { TextField, Button, MenuItem, Container, Box, FormControl, Select, InputLabel } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function HomePage() {
	const navigate = useNavigate();
	const { globalUsername, apiURL } = useUser();
	
	const [sign, setSign] = useState('+');
	const [number, setNumber] = useState(null);
	const [selectedDate, setSelectedDate] = useState(DateTime.now());
	const [comments, setComments] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!number) {
			alert("Empty or incorrect amount format: only accepts numbers.");
			return;
		}

		let finalNumber = sign === "+" ? number : number * -1;

		try {
			const response = await fetch(`${apiURL}/sendTransaction`, {
				method: 'POST',
			  	headers: { 'Content-Type': 'application/json' },
			  	body: JSON.stringify({ globalUsername, finalNumber, selectedDate, comments })
			});
	  
			const data = await response.json();
	  
			if (response.ok && data.status === "success") {
				window.location.reload();
			}
			else {
				alert(data.detail || 'An error occurred while sending information.');
			}
		}
		catch (error) {
			console.error('Network error:', error);
			alert('Network error: Could not connect to server.');
		}
	}

	return (
		<>
			<Nav />
		
			<Container component="main" maxWidth="sm"> {/* maxWidth=xs, sm, md, lg, xl */}
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
				
					<div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>

						<FormControl variant="outlined">
							<InputLabel id="sign-label">Sign</InputLabel>
							<Select
								id="sign-select"
								labelId="sign-label"
								value={sign}
								onChange={e => setSign(e.target.value)}
								label="Sign"
							>
								<MenuItem value="+">+</MenuItem>
								<MenuItem value="-">-</MenuItem>
							</Select>
						</FormControl>

						<TextField
							required
							label="Amount"
							type="number"
							variant="outlined"
							placeholder='0.0 CAD'
							value={number}
							onChange={e => setNumber(e.target.value)}
						/>
					</div>

					<LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DatePicker
                            label="Date"
                            value={selectedDate}
                            onChange={newValue => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

					<TextField
						style={{ marginTop: 20 }}
						multiline
						rows={3}
						label="Comments (optional)"
						variant="outlined"
						fullWidth
						value={comments}
						onChange={e => setComments(e.target.value)}
					/>

					<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
						Submit
					</Button>

				</Box>
			</Container>
		</>
	);
}

export default HomePage;
