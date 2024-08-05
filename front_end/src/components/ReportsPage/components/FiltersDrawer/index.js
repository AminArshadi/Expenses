import { Box, TextField, Autocomplete, Drawer, Divider } from '@mui/material'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { Button, ButtonGroup } from '@blueprintjs/core'

const ReportsPage = ({
  filterDrawerOpen,
  setFilterDrawerOpen,
  defaultFromDate,
  selectedFromDate,
  setSelectedFromDate,
  defaultToDate,
  selectedToDate,
  setSelectedToDate,
  selectedAmountLessThan,
  setSelectedAmountLessThan,
  selectedAmountGreaterThan,
  setSelectedAmountGreaterThan,
  userGroups,
  selectedUserGroup,
  setSelectedUserGroup,
  getUserTransactions
}) => {

  const handleApplyFilters = () => {
    getUserTransactions()
    setFilterDrawerOpen(false)
  }

  const handleResetAllFilters = () => {
    setSelectedFromDate(defaultFromDate)
    setSelectedToDate(defaultToDate)
    setSelectedAmountLessThan(null)
    setSelectedAmountGreaterThan(null)
    setSelectedUserGroup('All')
  }

  return (
    <Drawer anchor='right' open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
      <Box  component= 'h1' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        Filters
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', mt: 4 }}>
        <Autocomplete
          options={userGroups}
          value={selectedUserGroup}
          onChange={(event, newValue) => { newValue ? setSelectedUserGroup(newValue) : setSelectedUserGroup('All') }}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} label="Select group" variant="outlined" />
          )}
          sx={{ width: 472 }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'row', p: 2, mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="From"
              value={selectedFromDate}
              onChange={newValue => setSelectedFromDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />

            <div style={{ width: 10 }} />

            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DatePicker
                label="To"
                value={selectedToDate}
                onChange={newValue => setSelectedToDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </LocalizationProvider>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', width: 504, height: 88, alignItems: 'center', justifyContent: 'center' }}>
          <TextField
            label="Amount greater than..."
            type="number"
            variant="outlined"
            placeholder='0.0 CAD'
            value={selectedAmountGreaterThan}
            onChange={e => setSelectedAmountGreaterThan(e.target.value)}
            sx={{ width: 231, height: 56 }}
          />

          <div style={{ width: 10 }} />

          <TextField
            label="Amount less than..."
            type="number"
            variant="outlined"
            placeholder='0.0 CAD'
            value={selectedAmountLessThan}
            onChange={e => setSelectedAmountLessThan(e.target.value)}
            sx={{ width: 231, height: 56 }}
          />
        </Box>
      </Box>

      <ButtonGroup fill large style={{ display: 'flex', flexDirection: 'column', height: '110px', padding: '10px' }}>
        <Button
          intent='primary'
          text='Apply'
          icon='filter-open'
          onClick={handleApplyFilters}
          style={{ borderRadius: '20px' }}
        />

        <Button
          intent='danger'
          text='Reset'
          icon='filter-remove'
          onClick={handleResetAllFilters}
          style={{ borderRadius: '20px', marginTop: '10px' }}
        />
      </ButtonGroup>
    </Drawer>
  )
}

export default ReportsPage
