import Nav from './../../sharedComponents/Nav'
import Loading from './../../sharedComponents/Loading'
import { useUser } from './../../UserContext'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, TextField, Button, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, Autocomplete, Paper, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

const GroupsPage = () => {
  const { apiURL, setLoading } = useUser()

  const { username } = useParams()

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  const [ usernames, setUsernames ] = useState([])
  const [ groups, setGroups ] = useState([])

  const [open, setOpen] = useState(false)

  const [groupName, setGroupName] = useState('')
  const [selectedMembersUsernames, setSelectedMembersUsernames] = useState([])

  useEffect(() => {
    getUsernames()
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

  const handleOpenFab = () => {
    setOpen(true)
  }

  const handleCloseFab = () => {
    setGroupName('')
    setSelectedMembersUsernames([])
    setOpen(false)
  }

  const resetFields = () => {
    getUsernames()
    getGroups()
    setGroupName('')
    setSelectedMembersUsernames([])
    setOpen(false)
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

  const getUsernames = async () => {
    setLoading(true)
    try {
			const response = await fetch(`${apiURL}/getUsernames`, {
				method: 'GET',
        headers: { 'Content-Type': 'application/json' }
			})

			const data = await response.json()

			if (response.ok && data.status === "success") {
				setUsernames(data.usernames)
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

  const handleAddGroup = async (event) => {
		event.preventDefault()

    // Validation for groupName
		if (!groupName) {
      showAlert("Choose a name for your new group.", 'warning')
			return
		}

    // Validation for selectedMembersUsernames
		if (selectedMembersUsernames.length === 0) {
      showAlert("Select the username of the people you want to add to the group.", 'warning')
			return
		}

    setLoading(true)
    try {
			const response = await fetch(`${apiURL}/groups/addGroup`, {
				method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: groupName,
          admin_username: username,
          members_usernames: selectedMembersUsernames,
        })
			})

			const data = await response.json()

			if (response.ok && data.status === "success") {
        resetFields()
        showAlert(`Group ${groupName} is created.`, 'success')
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

    const handleEditGroup = async (event, group) => {
    event.preventDefault()
    // Handle edit group functionality
    console.log('Edit group', group)
  }

  const handleDeleteGroup = async (event, group) => {
    event.preventDefault()

    setLoading(true)
    try {
      const response = await fetch(`${apiURL}/groups/deleteGroup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: group,
          admin_username: username,
        })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        getGroups()
        showAlert(data.msg, 'success')
      }
      else {
        showAlert(data.msg || 'An error occurred while sending information.', 'error')
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
      
      <Container component="main" maxWidth="md">

        <Button variant="contained" onClick={handleOpenFab} sx={{ position: 'absolute', right: 50, bottom: 60 }}>
          Create group
          <AddIcon />
        </Button>

        <TableContainer component={Paper} elevation={10} sx={{ mt: 5, borderRadius: 2, boxShadow: 3, maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid lightgrey' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ paddingTop: 10, color: 'lightgrey', height: 70 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <GroupAddIcon sx={{ fontSize: 60, mb: 1 }} />
                      You are not currently in any groups. Create a new group to get started.
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group, index) => (
                  <TableRow key={index} sx={{ height: 70, '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ height: 70, verticalAlign: 'middle', fontSize: '1rem', color: '#555' }}>{group}</TableCell>
                    <TableCell align="right" sx={{ height: 70, verticalAlign: 'middle' }}>
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'black',
                          borderColor: 'black',
                          '&:hover': { backgroundColor: 'grey', borderColor: 'white', color: 'white' },
                          marginRight: 1
                        }}
                        onClick={(e) => handleEditGroup(e, group)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'red',
                          borderColor: 'red',
                          '&:hover': { backgroundColor: 'red', borderColor: 'white', color: 'white' }
                        }}
                        onClick={(e) => handleDeleteGroup(e, group)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleCloseFab} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>New Group</DialogTitle>
          <DialogContent dividers>
            <Box component="form" noValidate sx={{ mt: 1, mb: 1 }}>
              <TextField
                required
                autoFocus
                fullWidth
                label="Group Name"
                type="text"
                variant="outlined"
                margin="dense"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                options={usernames.filter((elem) => elem !== username)}
                value={selectedMembersUsernames}
                onChange={(event, newValue) => setSelectedMembersUsernames(newValue)}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} required label="Members" variant="outlined" />}
                sx={{ mt: 2, minWidth: 500 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'right', pb: 2, mr: 2, mt: 1 }}>
            <Button onClick={handleCloseFab} color="primary" variant="outlined" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup} color="primary" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>

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

export default GroupsPage
