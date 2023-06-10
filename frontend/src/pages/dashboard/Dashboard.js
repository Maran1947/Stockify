import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Stack, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import CircleIcon from '@mui/icons-material/Circle';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import axios from 'axios';
import GLTable from '../../components/tables/GLTable';

export default function Dashboard() {

  const [marketStatus, setMarketStatus] = useState([]);
  const [type, setType] = useState('gainers');

  const getMarketStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/analysis/market-status`);
      if (response.status === 200) {
        console.log(response.data.marketStatus.marketState);
        setMarketStatus(response.data.marketStatus.marketState);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    getMarketStatus();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={{
            width: '100%'
          }} >
          <Typography sx={{
            fontSize: '1.5rem',
            mb: 2
          }} >Market Status</Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2} >
          {
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
            })
          }
        </Stack>
      </Stack>
      <Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={{
            width: '100%',
            mt:3
          }} >
          <Typography sx={{
            fontSize: '1.5rem',
            mb: 2
          }} >Top Gainers and losers</Typography>
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
              '&:hover':{ 
                background: "transparent",
                color:'#4caf50',
                border: '1px solid #4caf50',
                boxShadow:'none' 
              } 
            }} >Gainers</Button>
          <Button 
            variant="contained" 
            onClick={() => setType('losers')}
            sx={{ 
              background: "#d43725", 
              color: '#fff',
              '&:hover':{ 
                background: "transparent",
                color:'#d43725',
                border: '1px solid #d43725',
                boxShadow:'none' 
              }  
            }} >Losers</Button>
        </Stack>
        <Stack sx={{
          mt: 2,
          overflowY:'auto',
          height:'600px'
        }} >
          <GLTable type={type} />
        </Stack>
      </Stack>
    </Box>
  );
}