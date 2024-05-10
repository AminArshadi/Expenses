import { useUser } from './UserContext';
import Nav from './Nav.js';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Fab, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function GroupsPage() {
  const navigate = useNavigate();
  const { globalUsername, apiURL } = useUser();

  const [ usernames, setUsernames ] = useState([]);
  const [ groups, setGroups ] = useState([]);

  const [open, setOpen] = useState(false);

  const [groupName, setGroupName] = useState('')
  const [adminUsername, setAdminUsername] = useState(globalUsername)
  const [selectedUsernames, setSelectedUsernames] = useState([]);

  useEffect(() => {
    getUsernames()
    getGroups()
  }, []);

  const handleOpenFab = () => {
    setOpen(true)
  }

  const handleCloseFab = () => {
    setOpen(false)
  }

  const getGroups = async () => {
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
				alert(data.detail || 'An error occurred while sending information.');
			}
		}
		catch (error) {
			console.error('Network error:', error);
			alert('Network error: Could not connect to server.');
		}
  }

  const getUsernames = async () => {
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
				alert(data.detail || 'An error occurred while sending information.');
			}
		}
		catch (error) {
			console.error('Network error:', error);
			alert('Network error: Could not connect to server.');
		}
  }

  const handleAddGroup = async (event) => {
		event.preventDefault()

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
				window.location.reload()
        alert(`Group ${groupName} is created.`)
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
      
      <Container component="main" maxWidth="sm">

        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

          <Box component="form" noValidate sx={{ mt: 1 }}>

            <List sx={{ minHeight: 300, maxHeight: 500, overflow: 'auto', width: 800, border: '1.5px solid black', borderRadius: 2, padding: 3}}>
              {
                groups.length == 0 ?
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

        </Box>

        <Dialog open={open} onClose={handleCloseFab}>

          <DialogTitle>Create New Group</DialogTitle>

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
              options={usernames}
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
                  Add
              </Button>
          </DialogActions>

        </Dialog>

      </Container>
    </>
  )
}

export default GroupsPage;
