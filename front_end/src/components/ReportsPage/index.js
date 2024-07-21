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

const ReportsPage = () => {
  const { apiURL, setLoading } = useUser()

  const { username } = useParams()

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const [selectedFromDate, setSelectedFromDate] = useState(null)
  const [selectedToDate, setSelectedToDate] = useState(null)

  const [selectedAmountLessThan, setSelectedAmountLessThan] = useState(null)
  const [selectedAmountGreaterThan, setSelectedAmountGreaterThan] = useState(null)

  const [userGroups, setUserGroups] = useState([])
  const [selectedUserGroup, setSelectedUserGroup] = useState('All')
  
  const [userTransactions, setUserTransactions] = useState([])
  const [filteredUserTransactionsOnSelectedUserGroup, setFilteredUserTransactionsOnSelectedUserGroup] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const filteredUserTransactions = filteredUserTransactionsOnSelectedUserGroup.filter(row => {
    return Object.values(row).some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
  })

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  useEffect (() => {
    getUserTransactions()
  }, [])

  useEffect(() => {
    if (selectedUserGroup && selectedUserGroup !== 'All') {
      setFilteredUserTransactionsOnSelectedUserGroup(userTransactions.filter(
        row => String(row.group) === selectedUserGroup
      ))
    }
    else {
      setFilteredUserTransactionsOnSelectedUserGroup(userTransactions)
    }
  }, [selectedUserGroup])

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
        body: JSON.stringify({ username })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        setUserGroups(data.user_groups_list)
        const format_transactions = data.transactions_list.map((item) => ({
          ...item,
          date: new Date(item.date),
        }))
        setUserTransactions(format_transactions)
        setFilteredUserTransactionsOnSelectedUserGroup(format_transactions)
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
      ["Year", "Month", "Day", "Time", "Amount", "Reason", "Group", "Comments"],
      ...filteredUserTransactions.map(item => [
        item.date.getFullYear(),
        item.date.getMonth() + 1,
        item.date.getDate(),
        `${item.date.getHours()}:${item.date.getMinutes()}:${item.date.getSeconds()}`,
        item.amount,
        item.reason,
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
      label: 'Year',
      renderCell: (item) => {
        return `${item.date.getFullYear()}`
      },
    },
    {
      label: 'Month',
      renderCell: (item) => {
        return `${item.date.getMonth() + 1}`
      },
    },
    {
      label: 'Day',
      renderCell: (item) => {
        return `${item.date.getDate()}`
      },
    },
    {
      label: 'Time',
      renderCell: (item) => {
        return `${item.date.getHours()}:${item.date.getMinutes()}:${item.date.getSeconds()}`
      },
    },
    { label: 'Amount', renderCell: (item) => item.amount },
    { label: 'Reason', renderCell: (item) => item.reason },
    { label: 'Group', renderCell: (item) => item.group },
    { label: 'Comments', renderCell: (item) => item.comments },
  ]

  return (
    <>
      <Nav username={username} />

      <Loading />
        
      <FiltersDrawer
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        selectedFromDate={selectedFromDate}
        setSelectedFromDate={setSelectedFromDate}
        selectedToDate={selectedToDate}
        setSelectedToDate={setSelectedToDate}
        selectedAmountLessThan={selectedAmountLessThan}
        setSelectedAmountLessThan={setSelectedAmountLessThan}
        selectedAmountGreaterThan={selectedAmountGreaterThan}
        setSelectedAmountGreaterThan={setSelectedAmountGreaterThan}
        userGroups={userGroups}
        selectedUserGroup={selectedUserGroup}
        setSelectedUserGroup={setSelectedUserGroup}
      />

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={hideAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={hideAlert} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Container component="main" maxWidth="md">
        <Paper elevation={10} sx={{ position: 'absolute', top: 90, left: 20, right: 20, borderRadius: 2, boxShadow: 3, p: 2 }}>
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

          <CompactTable columns={columns} data={data} theme={theme} />
        </Paper>
      </Container>
    </>
  )
}

export default ReportsPage
