import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Watchlist from '../../components/watchlist/Watchlist';
import { Outlet, useNavigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  maxHeight:'100%',
  height:'100%'
}));

export default function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('cmUser')) {
      navigate('/signup', { replace: true })
    } else {
      navigate('/dashboard', { replace: true });
    }
    
  },[]);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2} >
        <Grid item xs={4}>
          <Item>
              <Watchlist />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            <Outlet />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}