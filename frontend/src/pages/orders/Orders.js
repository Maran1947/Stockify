import { Box, Typography, Tabs, Tab, Stack } from '@mui/material'
import React, { useState } from 'react'
import OrdersTable from '../../components/tables/OrdersTable'
import PropTypes from 'prop-types';
import RefreshIcon from '@mui/icons-material/Refresh';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Orders() {

  const [value, setValue] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} >
        <Typography sx={{
          textAlign: 'left',
          p: 2,
          color: '#000'
        }} variant='h5' >Orders</Typography>
        <RefreshIcon sx={{
          cursor: 'pointer'
        }} onClick={() => setRefresh(true)} />
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example">
            <Tab sx={{
              color: '#c4c4cc'
            }} label="Open" {...a11yProps(0)} />
            <Tab sx={{
              color: '#c4c4cc'
            }} label="Executed" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <OrdersTable status={"Open"} refresh={refresh} setRefresh={setRefresh} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <OrdersTable status={"Executed"} refresh={refresh} setRefresh={setRefresh} />
        </TabPanel>

      </Box>
    </Box>
  )
}

export default Orders
