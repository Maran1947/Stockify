import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Divider, Stack, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import CircleIcon from '@mui/icons-material/Circle';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import axios from 'axios';
import GLTable from '../../components/tables/GLTable';
import RefreshIcon from '@mui/icons-material/Refresh';
import moment from 'moment';
import Loading from '../../components/loading/Loading';

export default function Dashboard() {

  const [marketStatus, setMarketStatus] = useState([]);
  const [type, setType] = useState('gainers');
  const [refreshGL, setRefreshGL] = useState(false);
  const [marketHolidays, setMarketHolidays] = useState({});
  const [upcomingHolidays, setUpcomingHolidays] = useState({});
  const [refreshMS, setRefreshMS] = useState(false);
 
  const getMarketStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/analysis/market-status`);
      if (response.status === 200) {
        // console.log(response.data.marketStatus.marketState);
        setMarketStatus(response.data?.marketStatus?.marketState);
      }
    } catch (err) {
      console.log(err);
      // alert("Something went wrong");
    }
  }

  const refreshMarketStatus = async () => {
    try {
      setRefreshMS(true);
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/analysis/market-status/save`);
      if (response.status === 200) {
        getMarketStatus();
        setRefreshMS(false);
      }
    } catch (err) {
      console.log(err);
      setRefreshMS(false);
      alert("Something went wrong");
    }
  }

  const getUpcomingHoliday = (holidays) => {
    const today = moment();
    const upcomingHolidays = holidays?.filter(holiday => moment(holiday.tradingDate).isAfter(today));
    const nearestHoliday = upcomingHolidays?.length > 0 ? upcomingHolidays[0] : null;

    if (nearestHoliday) {
      const holidayDate = moment(nearestHoliday.tradingDate);
      const daysRemaining = holidayDate.diff(today, 'days');

      return {
        tradingDate: nearestHoliday.tradingDate,
        weekDay: nearestHoliday.weekDay,
        description: nearestHoliday.description,
        daysRemaining: daysRemaining
      };  
    }
  }

  const getMarketHolidays = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/market-holidays/get`);
      
      if (response.status === 200) {
        setMarketHolidays(response.data?.tradingHolidays);
        setUpcomingHolidays(getUpcomingHoliday(response.data?.tradingHolidays?.CM));
      }
    } catch (err) {
      console.log(err);
      // alert("Something went wrong");
    }
  }

  const handleRefreshMarketStatus = async () => {
    refreshMarketStatus();
  }

  const handleRefreshGainerLosers = async () => {
    setRefreshGL(true);
  }

  useEffect(() => {
    getMarketStatus();
    getMarketHolidays();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: '100%'
          }} >
          <Typography sx={{
            fontSize: '1.5rem',
            mb: 2
          }} >Market Status</Typography>
          {
            refreshMS ?
            <Loading /> : 
            <RefreshIcon sx={{
              cursor: 'pointer',
              marginBottom: '1rem!important'
            }} onClick={handleRefreshMarketStatus} />
          }
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2} >
          {
            marketStatus && marketStatus?.length > 0 ?
            marketStatus.map((market) => {
              return <Chip
                sx={{
                  p: 1
                }}
                key={market.market}
                icon={market.marketStatus.toLowerCase() === 'open' ? <CircleIcon /> : <HorizontalRuleIcon />}
                color={market.marketStatus.toLowerCase() === 'open' ? "success" : "info"}
                label={market.market.toUpperCase()}
                variant="outlined" />
            }) : <Typography>No data found.</Typography>
          }
        </Stack>
      </Stack>
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: '100%',
            mt: 3
          }} >
          <Typography sx={{
            fontSize: '1.5rem',
            mb: 2
          }} >Top Gainers and losers</Typography>
          {
            refreshGL ?
            <Loading /> :
            <RefreshIcon sx={{
              cursor: 'pointer',
              marginBottom: '1rem!important'
            }} onClick={handleRefreshGainerLosers} />
          }
        </Stack>
        <Stack
          direction="row"
          spacing={2} >
          <Button
            variant="contained"
            onClick={() => setType('gainers')}
            sx={{
              background: "#4caf50",
              color: '#fff',
              '&:hover': {
                background: "transparent",
                color: '#4caf50',
                border: '1px solid #4caf50',
                boxShadow: 'none'
              }
            }} >Gainers</Button>
          <Button
            variant="contained"
            onClick={() => setType('losers')}
            sx={{
              background: "#d43725",
              color: '#fff',
              '&:hover': {
                background: "transparent",
                color: '#d43725',
                border: '1px solid #d43725',
                boxShadow: 'none'
              }
            }} >Losers</Button>
        </Stack>
        <Stack sx={{
          mt: 2,
          overflowY: 'auto',
          height: '600px'
        }} >
          <GLTable
            type={type}
            refreshGL={refreshGL}
            setRefreshGL={setRefreshGL} />
        </Stack>
      </Stack>
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: '100%',
            mt: 5
          }} >
          <Typography sx={{
            fontSize: '1.5rem',
            mb: 2
          }} >Market Holidays</Typography>
        </Stack>
        <Stack>
          {
            marketHolidays ?
            marketHolidays?.CM?.map((holiday, index) => {
              return (
                <div key={holiday.tradingDate + index}> 
                  <Divider />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-around"
                    sx={{
                      py: 2,
                    }} >
                    <Stack 
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    sx={{
                      width:'50%'
                    }} >
                      <Typography sx={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: upcomingHolidays?.tradingDate === holiday.tradingDate && '#001eff',
                      }} >{holiday.description}</Typography>
                      {
                        upcomingHolidays?.tradingDate === holiday.tradingDate &&
                      <Typography sx={{
                        padding: '0.3rem 0.8rem',
                        background:'#e0ffe8',
                        color:'#0ee07b',
                        borderRadius:'5px',
                        fontSize: '0.9rem'
                      }} >{upcomingHolidays.daysRemaining}{" days remaining"}</Typography>
                      }
                    </Stack>
                    <Typography sx={{
                      width: '25%',
                      color: upcomingHolidays?.tradingDate === holiday.tradingDate && '#001eff',
                      fontWeight: upcomingHolidays?.tradingDate === holiday.tradingDate && 'bold'  
                    }} >{holiday.tradingDate}</Typography>
                    <Typography sx={{
                      width: '25%',
                      color: upcomingHolidays?.tradingDate === holiday.tradingDate && '#001eff',
                      fontWeight: upcomingHolidays?.tradingDate === holiday.tradingDate && 'bold'  
                    }} >{holiday.weekDay}</Typography>
                  </Stack>
                </div>
              )
            }) :  <Typography>No data found.</Typography>
          }
        </Stack>
      </Stack>
    </Box>
  );
}