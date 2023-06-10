import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
// import DataService from '../../services/DataService';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import BuySellModal from '../modals/BuySellModal';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading';

let BASE_URL = "http://localhost:5000/api";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: '1rem 0.2rem',
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none',
    borderBottom: '1px solid #B0A8B9',
    borderRadius: '0px   '
}));

function Watchlist() {

    const [inputStock, setInputStock] = useState('');
    const [stocks, setStocks] = useState([]);
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(false);
    const [userId, setUserId] = useState('');
    const [open, setOpen] = useState(false);
    const [stock, setStock] = useState({});
    const [orderType, setOrderType] = useState('');
    const [loadingId, setLoadingId] = useState('');

    const navigate = useNavigate();

    const handleSearchStock = async () => {

        try {
            const response = await axios.get(`http://localhost:5000/api/scrip/search?scriptName=${inputStock}`);
            if (response.status === 200) {
                setStocks(response.data.data);
            }
        } catch (err) {
            console.log(err);
            alert("Internal server error");
        }
    }

    const handleAddStockToWatchlist = async (stock) => {
        const data = {
            userId: userId,
            scriptId: stock._id
        }
        try {
            setLoadingId(stock._id);
            const response = await axios.post(`${BASE_URL}/watchlist/add`, data);
            if (response.status === 200) {
                getUserWatchlist();
                setInputStock('');
                setLoadingId('');
                setStocks([]);
                alert('Added to watchlist');
            }
        } catch (err) {
            console.log(err);
            setLoadingId('');
            alert(err.response.data.message);
        }
    }

    const handleRemoveStockToWatchlist = async (watchlistStockId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/watchlist/remove?watchlistScripId=${watchlistStockId}`);
            if (response.status === 200) {
                getUserWatchlist();
                alert('Removed')
            }
        } catch (err) {
            console.log(err);
            alert('Something went wrong');
        }
    }

    const getUserWatchlist = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/watchlist/get?userId=${userId}`);
            if (response.status === 200) {
                setUserWatchlist(response.data.data);
            }
        } catch (err) {
            console.log(err);
            alert("Internal server error");
        }
    }

    const handleBuySellStock = (stock, type) => {
        console.log(type);
        setOpen(true);
        setOrderType(type)
        setStock(stock);
    };

    const handleShowChart = (stock) => {
        navigate(`/chart?symbol=${stock.scriptId.originalName}`);
    }

    useEffect(() => {
        setUserId(JSON.parse(localStorage.getItem('cmUser'))?.userid);
        if (userId) getUserWatchlist();
    }, [userId]);

    useEffect(() => {

        if (userId) {

            const ws = new WebSocket('ws://localhost:5000');

            const DataService = {
                "ws": (userId) => {
                    ws.onopen = () => {
                        console.log("Connected to websocket!!", userId);
                        ws.send(JSON.stringify({
                            userId: userId
                        }));
                    }
                    ws.onclose = () => {
                        console.log("Connection closed!!");
                    }
                    return ws;
                }
            }

            DataService.ws(userId).onmessage = (ev) => {
                let watchlistData = JSON.parse(ev.data);
                // console.log(watchlistData.scrips);
                if (watchlistData.scrips.length > 0) setUserWatchlist(watchlistData.scrips);
            }
        }

    }, [userId]);

    return (
        <Box sx={{ width: '100%', height: '600px' }}>
            <BuySellModal
                open={open}
                setOpen={setOpen}
                orderType={orderType}
                stock={stock} />
            <Box>
                <Stack direction="row" spacing={1} >
                    <TextField
                        sx={{
                            width: '80%'
                        }}
                        value={inputStock}
                        onChange={(e) => setInputStock(e.target.value.toUpperCase())}
                        color="secondary"
                        id="outlined-basic"
                        label="Search stock"
                        variant="outlined" />
                    <Button onClick={handleSearchStock} sx={{
                        color: '#fff',
                        background: '#D43725',
                        fontSize: '0.9rem!important',
                        padding: '0.5rem 2rem',
                        '&:hover': {
                            background: '#D43725',
                            opacity: 0.8
                        }
                    }} >Search</Button>
                </Stack>
            </Box>
            <Box sx={{
                overflowY: 'auto',
                height: '530px',
                margin: '1rem 0rem'
            }} >
                {
                    inputStock && stocks.length > 0 ?
                        <Stack>
                            {
                                stocks ?
                                    stocks.map((stock) => {
                                        return (
                                            <Item key={stock._id} >
                                                <Stack direction="row" alignItems="center" justifyContent="space-between" >
                                                    <Typography sx={{ color: '#000' }} >{stock.symbol}</Typography>
                                                    {
                                                        loadingId === stock._id ?
                                                        <Loading /> :
                                                        <AddIcon
                                                        onClick={() => handleAddStockToWatchlist(stock)}
                                                        sx={{
                                                            '&:hover': {
                                                                cursor: 'pointer'
                                                            }
                                                        }} /> 
                                                    }
                                                </Stack>
                                            </Item>
                                        )
                                    }) : <Typography>No Stocks found.</Typography>
                            }
                        </Stack>
                        : <Stack>
                            {
                                userWatchlist.length > 0 ?
                                    userWatchlist.map((stock) => {
                                        return (
                                            <Item
                                                key={stock._id} >
                                                <Grid container spacing={2}
                                                    onMouseOver={() => setHoverIndex(stock._id)}
                                                    onMouseLeave={() => setHoverIndex(-1)} >
                                                    <Grid item xs={8}>
                                                        <Typography>{stock.scriptId.symbol}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        {
                                                            hoverIndex === stock._id ?
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    spacing={2}
                                                                >
                                                                    <Stack
                                                                        justifyContent="center"
                                                                        alignItems="center"
                                                                        sx={{
                                                                            background: "#1976d2",
                                                                            width: '22px',
                                                                            height: '22px',
                                                                            color: '#fff',
                                                                            borderRadius: '2px',
                                                                            cursor: 'pointer',
                                                                            boxShadow: '0px 0px 3px 2px #bddfc3'
                                                                        }} >
                                                                        <Typography
                                                                            onClick={() => handleBuySellStock(stock, 'Buy')}
                                                                            sx={{
                                                                                fontSize: '0.9rem'
                                                                            }} >B</Typography>
                                                                    </Stack>
                                                                    <Stack justifyContent="center"
                                                                        alignItems="center"
                                                                        sx={{
                                                                            background: "#d43725",
                                                                            width: '22px',
                                                                            height: '22px',
                                                                            color: '#fff',
                                                                            borderRadius: '2px',
                                                                            cursor: 'pointer',
                                                                            boxShadow: '0px 0px 3px 2px #bddfc3'
                                                                        }} >
                                                                        <Typography
                                                                            onClick={() => handleBuySellStock(stock, 'Sell')}
                                                                            sx={{
                                                                                fontSize: '0.9rem'
                                                                            }} >S</Typography>
                                                                    </Stack>
                                                                    <Stack sx={{
                                                                        background: "#fff",
                                                                        cursor: 'pointer',
                                                                        boxShadow: '0px 0px 3px 2px #bddfc3'
                                                                    }} >
                                                                        <DeleteIcon onClick={() => handleRemoveStockToWatchlist(stock._id)} />
                                                                    </Stack>
                                                                    <Stack sx={{
                                                                        background: "#fff",
                                                                        cursor: 'pointer',
                                                                        boxShadow: '0px 0px 3px 2px #bddfc3'
                                                                    }} >
                                                                        <InsertChartIcon onClick={() => handleShowChart(stock)} />
                                                                    </Stack>
                                                                </Stack> :
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    justifyContent="space-between"
                                                                    spacing={2}
                                                                >
                                                                    <Typography sx={{
                                                                        color: parseFloat(stock.scriptId.percentageChange) > 0 ? '#0ee07b' : '#f64d41'
                                                                    }} >{stock.scriptId.percentageChange ? stock.scriptId.percentageChange : 0}%</Typography>
                                                                    <Typography>{stock.scriptId.lastPrice ? stock.scriptId.lastPrice : 0}</Typography>
                                                                </Stack>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Item>
                                        )
                                    }) :
                                    <Typography>No stocks in watchlist.</Typography>
                            }
                        </Stack>
                }
            </Box>
        </Box>
    )
}

export default Watchlist;