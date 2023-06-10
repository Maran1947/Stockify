import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading';

function Account() {

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const userId = JSON.parse(localStorage.getItem('cmUser')).userid;
      try {
        setLoading(true);
        const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/user/reset?userId=${userId}`);
        if(response.status === 200) {
          setLoading(false);
          getUser();
          alert('Reset successfully');
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        alert('Something went wrong');
      }
  }

  const getUser = async () => {
    const userId = JSON.parse(localStorage.getItem('cmUser')).userid;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/get?userId=${userId}`);
      if (response.status === 200) {
        setUserData(response.data.data.trader);
      }
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Box sx={{
      p: 5
    }} >
      <Stack justifyContent="center" alignItems="center" >
        <Stack sx={{
          width: '200px',
          height: '200px',
          background: '#d4372560',
          borderRadius: '50%',
          mb: 5
        }} justifyContent="center" alignItems="center">
          <Typography variant="h3" sx={{
            color: '#fff'
          }} >{
              userData &&
                userData.fullName ?
                userData.fullName.split(' ')[0].toUpperCase()[0] + userData.fullName?.split(' ')[1]?.toUpperCase()[0] :
                'U'
            }</Typography>
        </Stack>
        <Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{
              mb: 3
            }}
            alignItems="center" >
            <Typography sx={{
              fontSize: '1.3rem',
            }} >User ID: </Typography>
            <TextField
              value={userData && userData.userId ? userData.userId : 'User ID'}
              color="secondary"
              id="outlined-basic"
              variant="outlined"
              contentEditable={false}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 3
            }}
            alignItems="center"
            justifyContent="space-between" >
            <Typography sx={{
              fontSize: '1.3rem',
            }} >Name: </Typography>
            <TextField
              value={userData && userData.fullName ? userData.fullName : 'Full Name'}
              color="secondary"
              id="outlined-basic"
              variant="outlined"
              contentEditable={false}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{
              mb: 3
            }}
            alignItems="center" >
            <Typography sx={{
              fontSize: '1.3rem',
            }} >Email: </Typography>
            <TextField
              value={userData && userData.email ? userData.email : 'Email'}
              color="secondary"
              id="outlined-basic"
              variant="outlined"
              contentEditable={false}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{
              mb: 3
            }}
            alignItems="center" >
            <Typography sx={{
              fontSize: '1.3rem',
            }} >Mobile: </Typography>
            <TextField
              value={userData && userData.mobile ? userData.mobile : 'Mobile'}
              color="secondary"
              id="outlined-basic"
              variant="outlined"
              contentEditable={false}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{
              mb: 3
            }}
            alignItems="center" >
            <Typography sx={{
              fontSize: '1.3rem',
            }} >Funds: </Typography>
            <TextField
              value={userData && userData.availableFunds ? userData.availableFunds : 'Available Funds'}
              color="secondary"
              id="outlined-basic"
              variant="outlined"
              contentEditable={false}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={{
        width: '100%'
      }}
        direction="row"
        justifyContent="flex-end"
        alignItems="center" >
        <Button
          onClick={handleReset}
          sx={{
            width: '200px',
            color: '#fff',
            background: '#D43725',
            fontSize: '0.9rem!important',
            padding: '0.5rem 2rem',
            '&:hover': {
              background: '#D43725',
              opacity: 0.8
            }
          }} >
            {
              loading ?
              <Loading color='#fff' /> :
              'Reset'
            }
          </Button>
      </Stack>
    </Box>
  )
}

export default Account