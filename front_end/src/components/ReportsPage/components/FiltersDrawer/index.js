import { Box, TextField, Autocomplete, Drawer } from '@mui/material'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { Button, ButtonGroup } from '@blueprintjs/core'

const ReportsPage = ({
  filterDrawerOpen,
  setFilterDrawerOpen,
  selectedFromDate,
  setSelectedFromDate,
  selectedToDate,
  setSelectedToDate,
  selectedAmountLessThan,
  setSelectedAmountLessThan,
  selectedAmountGreaterThan,
  setSelectedAmountGreaterThan,
  userGroups,
  selectedUserGroup,
  setSelectedUserGroup,
}) => {

  const handleResetAllFilters = () => {
    setSelectedFromDate(null)
    setSelectedToDate(null)
    setSelectedAmountLessThan(null)
    setSelectedAmountGreaterThan(null)
    setSelectedUserGroup('All')
    setFilterDrawerOpen(false)
  }

  return (
    <Drawer anchor='right' open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>

        <Box sx={{ display: 'flex', flexDirection: 'row', p: 2, mb: 2 }}>
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

        <Box sx={{ display: 'flex', flexDirection: 'row', mb: 4, width: 504, height: 88, alignItems: 'center', justifyContent: 'center' }}>
          <TextField
            label="Amount Greater Than"
            type="number"
            variant="outlined"
            placeholder='0.0 CAD'
            value={selectedAmountGreaterThan}
            onChange={e => setSelectedAmountGreaterThan(e.target.value)}
            sx={{ width: 231, height: 56 }}
          />

          <div style={{ width: 10 }} />

          <TextField
            label="Amount Less Than"
            type="number"
            variant="outlined"
            placeholder='0.0 CAD'
            value={selectedAmountLessThan}
            onChange={e => setSelectedAmountLessThan(e.target.value)}
            sx={{ width: 231, height: 56 }}
          />
        </Box>

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
      </Box>

      <ButtonGroup fill large>
        <Button
          intent='danger'
          text='Reset Filters'
          onClick={handleResetAllFilters}
        />
        <Button
          intent='primary'
          text='Apply'
        />
      </ButtonGroup>

    </Drawer>
  )
}

export default ReportsPage
