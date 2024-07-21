import Nav from './../../sharedComponents/Nav'
import Loading from './../../sharedComponents/Loading'
import { useUser } from './../../UserContext'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import { TextField, Autocomplete, Button, MenuItem, Container, FormControl, Select, InputLabel, Paper, Snackbar, Alert } from '@mui/material'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

const HomePage = () => {
	const { apiURL, setLoading } = useUser()

	const { username } = useParams()

	const [alertOpen, setAlertOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [severity, setSeverity] = useState('success')

	const [ groups, setGroups ] = useState([])
	
	const [sign, setSign] = useState('+')
	const [number, setNumber] = useState('')
	const [selectedDate, setSelectedDate] = useState(DateTime.now())
	const [reason, setReason] = useState(null)
	const reasons = [
		{ value: "gas", label: 'Gas' },
		{ value: "grocery", label: 'Grocery' },
		{ value: "rent", label: 'Rent' },
		{ value: "other", label: 'Other' },
	]
	const [selectedGroup, setSelectedGroup] = useState('')
	const [comments, setComments] = useState('')

	useEffect(() => {
		getGroups()
	}, [username])

	const showAlert = (message, severity) => {
		setMessage(message)
		setSeverity(severity)
		setAlertOpen(true)
	}

	const hideAlert = () => {
		setAlertOpen(false)
	}

	const resetFields = () => {
		setSign('+')
		setNumber('')
		setSelectedDate(DateTime.now())
		setReason(null)
		setSelectedGroup('')
		setComments('')
	}

	const getGroups = async () => {
		setLoading(true)
		try {
			const response = await fetch(`${apiURL}/getGroups`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username })
			})
		
			const data = await response.json()
		
			if (response.ok && data.status === "success") {
				setGroups(data.groups)
			}
			else {
				showAlert(data.detail || 'An error occurred while sending information.', 'error')
			}
		}
		catch (error) {
			console.error('Network error:', error)
			showAlert('Network error: Could not connect to server.', 'error')
		}
		finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		// Validation for amount
		if (!number) {
			showAlert("Empty or incorrect amount format: only accepts numbers.", 'warning')
			return
		}

		// Validation for reason
		if (!reason) {
			showAlert("Select a reason.", 'warning')
			return
		}

		// Validation for selectedGroup
		if (!selectedGroup) {
			showAlert("Select a group.", 'warning')
			return
		}

		setLoading(true)
		let finalNumber = sign === "+" ? number : number * -1
		try {
			const response = await fetch(`${apiURL}/sendTransaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, finalNumber, selectedDate, reason, selectedGroup, comments })
			})

			const data = await response.json()

			if (response.ok && data.status === "success") {
				resetFields()
				showAlert('Transaction submitted.', 'success')
			}
			else {
				showAlert(data.detail || 'An error occurred while sending information.', 'error')
			}
		}
		catch (error) {
			console.error('Network error:', error)
			showAlert('Network error: Could not connect to server.', 'error')
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Nav username={username} />
		
			<Container component="main" maxWidth="sm">

				<Paper elevation={10} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
				
					<div style={{ display: 'flex', gap: '10px', marginBottom: 20, alignContent: 'center' }} >

						<FormControl variant="outlined">
							<InputLabel id="sign-label">Sign</InputLabel>
							<Select
								id="sign-select"
								labelId="sign-label"
								value={sign}
								onChange={e => setSign(e.target.value)}
								label="Sign"
								sx={{width: '103%'}}
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

						<LocalizationProvider dateAdapter={AdapterLuxon}>
							<DatePicker
								label="Date"
								value={selectedDate}
								onChange={newValue => setSelectedDate(newValue)}
								renderInput={(params) => <TextField {...params} />}
							/>
						</LocalizationProvider>

					</div>

					<Autocomplete
						sx={{ mt: 2 }}
						fullWidth
						options={reasons}
						value={reasons.find(option => option.value === reason) || null}
						onChange={(event, newValue) => { newValue ? setReason(newValue.value) : setReason(null) }}
						getOptionLabel={(option) => option.label}
						renderInput={(params) => (
							<TextField {...params} required label="Reason" variant="outlined" />
						)}
					/>

					<Autocomplete
						sx={{ mt: 2 }}
						fullWidth
						options={groups}
						value={selectedGroup}
						onChange={(event, newValue) => setSelectedGroup(newValue)}
						getOptionLabel={(option) => option}
						renderInput={(params) => (
							<TextField {...params} required label="Group" variant="outlined" />
						)}
					/>

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

export default HomePage
