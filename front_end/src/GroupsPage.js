import { useUser } from './UserContext';
import Nav from './Nav.js';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, IconButton, Fab, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function GroupsPage() {

  const groups = [
    'group 1',
    'group 2',
    'group 3',
  ]

  return (
    <>
      <Nav />
      
      <Container component="main" maxWidth="sm">

        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

          <Box component="form" noValidate sx={{ mt: 1 }}>

            <List>
              {groups.length === 0 ? "You are not in any groups yet. Create a new group to get started." : groups.map((group, index) => (
                <ListItem key={index}>
                    <ListItemText primary={group} />
                </ListItem>
              ))}
            </List>

          </Box>

        </Box>

        <Fab color="primary" aria-label="add" sx={{ position: 'absolute', right: 100, bottom: 90  }}>
          <AddIcon />
        </Fab>

      </Container>
    </>
  )
}

export default GroupsPage;
