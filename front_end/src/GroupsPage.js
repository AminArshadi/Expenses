import Nav from './Nav.js';
import Loading from './Loading.js';
import { useUser } from './UserContext';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Fab, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Paper, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function GroupsPage() {
  const navigate = useNavigate();
  const { globalUsername, apiURL, setLoading } = useUser();

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setmessage] = useState('')
  const [severity, setSeverity] = useState('success')

  const [ usernames, setUsernames ] = useState([]);
  const [ groups, setGroups ] = useState([]);

  const [open, setOpen] = useState(false);

  const [groupName, setGroupName] = useState('')
  const [adminUsername, setAdminUsername] = useState(globalUsername)
  const [selectedUsernames, setSelectedUsernames] = useState([]);

  useEffect(() => {
    getUsernames()
    getGroups()
  }, [globalUsername]);

  const showAlert = (message, severity) => {
    setmessage(message);
    setSeverity(severity);
    setAlertOpen(true);
  }

  const hideAlert = () => {
    setAlertOpen(false)
  }

  const handleOpenFab = () => {
    setOpen(true)
  }

  const handleCloseFab = () => {
    setGroupName('')
    setSelectedUsernames([]);
    setOpen(false)
  }

  const resetFields = () => {
    getUsernames()
    getGroups()
    setGroupName('')
    setSelectedUsernames([]);
    setOpen(false)
  }

  const getGroups = async () => {
    setLoading(true)
    try {
			const response = await fetch(`${apiURL}/getGroups`, {
				method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalUsername })
			});

			const data = await response.json();

			if (response.ok && data.status === "success") {
				setGroups(data.groups)
			}
			else {
        showAlert(data.detail || 'An error occurred while sending information.', 'error');
			}
		}
		catch (error) {
			console.error('Network error:', error);
      showAlert('Network error: Could not connect to server.', 'error');
		}
    finally {
      setLoading(false);
    }
  }

  const getUsernames = async () => {
    setLoading(true)
    try {
			const response = await fetch(`${apiURL}/getUsernames`, {
				method: 'GET',
        headers: { 'Content-Type': 'application/json' }
			});

			const data = await response.json();

			if (response.ok && data.status === "success") {
				setUsernames(data.usernames)
			}
			else {
        showAlert(data.detail || 'An error occurred while sending information.', 'error');
			}
		}
		catch (error) {
			console.error('Network error:', error);
      showAlert('Network error: Could not connect to server.', 'error');
		}
    finally {
      setLoading(false);
    }
  }

  const handleAddGroup = async (event) => {
		event.preventDefault()

    // Validation for groupName
		if (!groupName) {
      showAlert("Choose a name for your new group.", 'warning');
			return;
		}

    // Validation for selectedUsernames
		if (selectedUsernames.length === 0) {
      showAlert("Select the username of the people you want to add to the group.", 'warning');
			return;
		}

    setLoading(true)
    try {
			const response = await fetch(`${apiURL}/groups/addGroup`, {
				method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: groupName,
          admin_username: adminUsername,
          members_usernames: selectedUsernames,
        })
			});

			const data = await response.json();

			if (response.ok && data.status === "success") {
        resetFields()
        showAlert(`Group ${groupName} is created.`, 'success')
			}
			else {
        showAlert(data.detail || 'An error occurred while sending information.', 'error');
			}
		}
		catch (error) {
			console.error('Network error:', error);
      showAlert('Network error: Could not connect to server.', 'error');
		}
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      
      <Container component="main" maxWidth="md">

        <Paper elevation={10} sx={{ mt: 8, p: 4, borderRadius: 2 }}>

          <Box component="form" noValidate sx={{ mt: 1 }}>

            <List sx={{ minHeight: 300, maxHeight: 500, overflow: 'auto', border: '1px solid black', borderRadius: 2, padding: 3}}>
              {
                groups.length === 0 ?
                  <ListItem sx={{ left: 140 }}>You are not in any groups yet. Create a new group to get started.</ListItem>
                  :
                  groups.map((group, index) => (
                    <ListItem key={index} sx={{border: '1px solid grey', borderRadius: 2, mb: 1}}>

                        <ListItemText primary={group} />

                        <Button variant="outlined" sx={{ color:'black', borderColor:'black', '&:hover': { backgroundColor: 'grey', borderColor: 'white', color: 'white' }}}>
                          Edit
                        </Button>

                        <Button variant="outlined" sx={{ color:'red', borderColor:'red', ml: 1, '&:hover': { backgroundColor: 'red', borderColor: 'white', color: 'white' }}}>
                          Leave
                        </Button>

                    </ListItem>
                  ))
              }

              <Fab color="primary" aria-label="add" onClick={handleOpenFab} sx={{ mt:2, position: 'absolute', left: '50%', bottom: 20, transform: 'translateX(-50%)' }}>
                <AddIcon />
              </Fab>
              
            </List>

          </Box>

        </Paper>

        <Dialog open={open} onClose={handleCloseFab}>

          <DialogTitle>New Group</DialogTitle>

          <DialogContent>
              <TextField
                required
                autoFocus
                fullWidth
                label="Group Name"
                type="text"
                variant="outlined" // outlined - filled - standard
                margin="dense"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
            <Autocomplete
              multiple
              sx={{ mt: 2, minWidth:500}}
              fullWidth
              options={usernames.filter(username => username !== globalUsername)}
              value={selectedUsernames}
              onChange={(event, newValue) => setSelectedUsernames(newValue)}
              getOptionLabel={(option) => option}
              renderInput={(params) => ( <TextField {...params} required label="Usernames" variant="outlined" /> )}
            />
          </DialogContent>

          <DialogActions>
              <Button onClick={handleCloseFab} color="primary">
                  Cancel
              </Button>
              <Button onClick={handleAddGroup} color="primary">
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

export default GroupsPage;
