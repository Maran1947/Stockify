import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function Loading({ color='#d43725' }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress sx={{
                color:color
            }} />
        </Box>
    )
}

export default Loading