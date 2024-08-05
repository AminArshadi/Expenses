import Nav from './../../sharedComponents/Nav'
import Loading from './../../sharedComponents/Loading'
import FiltersDrawer from './components/FiltersDrawer'
import { useUser } from './../../UserContext'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Paper, Snackbar, Alert, Box, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { CompactTable } from '@table-library/react-table-library/compact'
import { useTheme } from '@table-library/react-table-library/theme'
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/material-ui'
import { Button, ButtonGroup } from '@blueprintjs/core'
import { DateTime } from 'luxon'

const ReportsPage = () => {
  const { apiURL, setLoading } = useUser()

  const { username } = useParams()

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const [userGroups, setUserGroups] = useState([])
  const [selectedUserGroup, setSelectedUserGroup] = useState('All')

  const defaultFromDate = DateTime.now().minus({ months: 3 })
  const [selectedFromDate, setSelectedFromDate] = useState(defaultFromDate)
  const defaultToDate = DateTime.now()
  const [selectedToDate, setSelectedToDate] = useState(defaultToDate)

  const [selectedAmountGreaterThan, setSelectedAmountGreaterThan] = useState(null)
  const [selectedAmountLessThan, setSelectedAmountLessThan] = useState(null)
  
  const [userTransactions, setUserTransactions] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const filteredUserTransactions = userTransactions
    .filter(row => (selectedUserGroup && selectedUserGroup !== 'All') ? String(row.group) === selectedUserGroup : true)
    .filter(row => (selectedAmountGreaterThan) ? row.amount > selectedAmountGreaterThan : true)
    .filter(row => (selectedAmountLessThan) ? row.amount < selectedAmountLessThan : true)
    .filter(row => Object.values(row).some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase())))

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  useEffect (() => {
    getUserTransactions()
  }, [])

  const showAlert = (message, severity) => {
    setMessage(message)
    setSeverity(severity)
    setAlertOpen(true)
  }

  const hideAlert = () => {
    setAlertOpen(false)
  }

  const getUserTransactions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiURL}/transaction/getUserTransactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          selectedFromDate: selectedFromDate,
          selectedToDate: selectedToDate
        })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        setUserGroups(data.user_groups_list)
        const format_transactions = data.transactions_list.map((item) => ({
          ...item,
          date: new Date(item.date),
        }))
        setUserTransactions(format_transactions)
      }
      else {
        showAlert('An error occurred while sending information.', 'error')
      }
    }
    catch (error) {
      showAlert('Network error: Could not connect to server.', 'error')
    }
    finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const csvData = [
      ["Year", "Month", "Day", "Time", "Amount", "Reason", "User", "Group", "Comments"],
      ...filteredUserTransactions.map(item => [
        new Date(item.date).toLocaleDateString('en-US', { year: 'numeric' }),
        new Date(item.date).toLocaleDateString('en-US', { month: 'numeric' }),
        new Date(item.date).toLocaleDateString('en-US', { day: 'numeric' }),
        new Date(item.date).toLocaleTimeString(),
        item.amount,
        item.reason,
        item.username,
        item.group,
        item.comments
      ])
    ]

    const csvContent = csvData.map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'expenses.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const data = { nodes: filteredUserTransactions }
  const materialTheme = getTheme(DEFAULT_OPTIONS)
  const theme = useTheme(materialTheme)
  const columns = [
    {
      label: 'Date',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto' }}>
          {new Date(item.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
        </div>
      ),
    },
    {
      label: 'Time',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto' }}>
          {new Date(item.date).toLocaleTimeString()}
        </div>
      ),
    },
    {
      label: 'Amount',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto', color: item.amount < 0 ? 'red' : 'green' }}>
          {item.amount > 0 ? `+${item.amount}` : item.amount}
        </div>
      ),
    },
    {
      label: 'Reason',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto' }}>
          {item.reason}
        </div>
      ),
    },
    {
      label: 'User',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto' }}>
          {item.username}
        </div>
      ),
    },
    {
      label: 'Group',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto' }}>
          {item.group}
        </div>
      ),
    },
    {
      label: 'Comments',
      renderCell: (item) => (
        <div style={{ maxWidth: '200px', overflow: 'auto' }}>
          {item.comments}
        </div>
      ),
    },
  ]

  return (
    <>
      <Nav username={username} />

      <Loading />
        
      <FiltersDrawer
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        defaultFromDate={defaultFromDate}
        selectedFromDate={selectedFromDate}
        setSelectedFromDate={setSelectedFromDate}
        defaultToDate={defaultToDate}
        selectedToDate={selectedToDate}
        setSelectedToDate={setSelectedToDate}
        selectedAmountLessThan={selectedAmountLessThan}
        setSelectedAmountLessThan={setSelectedAmountLessThan}
        selectedAmountGreaterThan={selectedAmountGreaterThan}
        setSelectedAmountGreaterThan={setSelectedAmountGreaterThan}
        userGroups={userGroups}
        selectedUserGroup={selectedUserGroup}
        setSelectedUserGroup={setSelectedUserGroup}
        getUserTransactions={getUserTransactions}
      />

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={hideAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={hideAlert} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Container component="main" maxWidth="md">
        <Paper elevation={10} sx={{ position: 'absolute', top: 90, left: 20, right: 20, bottom: 20, borderRadius: 2, boxShadow: 3, p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1, justifyContent: 'space-between' }}>
            <TextField
              size='small'
              placeholder='Search'
              variant='outlined'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.54)' }} />
                )
              }}
              sx={{ width: '100%', '.MuiOutlinedInput-root': { borderRadius: 10 }, mr: 2 }}
            />

            <ButtonGroup>
              <Button
                minimal
                intent='primary'
                text='Download'
                rightIcon='download'
                onClick={handleDownload}
                style={{ borderRadius: '24px' }}
              />
              <Button
                minimal
                intent='primary'
                text='Filters'
                rightIcon='filter'
                onClick={() => setFilterDrawerOpen(true)}
                style={{ borderRadius: '24px' }}
              />
            </ButtonGroup>
          </Box>

          <Box sx={{ position: 'absolute', top: 70, left: 20, right: 20, bottom: 20, overflow: 'auto', border: '1.5px solid lightgray', borderRadius: 2 }}>
            <CompactTable
              columns={columns}
              data={data}
              theme={theme}
            />
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default ReportsPage
