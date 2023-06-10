import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import Loading from '../loading/Loading';
import RefreshIcon from '@mui/icons-material/Refresh';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 'none',
};

export default function ExitModal({ orderType, open, setOpen, positionData }) {
    const [productType, setProductType] = useState('');
    const [priceType, setPriceType] = useState('');
    const [qty, setQty] = useState('1');
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [marginRequired, setMarginRequired] = useState(0.00);

    const handleClose = () => {
        setQty(1);
        setPrice(0);
        setPriceType('');
        setProductType('');
        setOpen(false);
    };

    const handlePriceType = (e) => {
        setPriceType(e.target.value)
    }

    const handleProductType = (e) => {
        setProductType(e.target.value);
    }

    const handleOnOrder = async () => {
        if(!productType || !priceType ) {
            alert(`You haven't choose any one`);
            return;
        }

        const data = {
            userId: JSON.parse(localStorage.getItem('cmUser')).userid,
            posId: positionData.posId,
            priceType: priceType,
            productType: productType,
            avgPrice: positionData.ltp,
            qty: qty
        }

        setLoading(true);
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/stock/exit/${orderType.toLowerCase() === 'sell' ? 'buy' : 'sell' }`, data);
            if (response.status === 200) {
                setLoading(false);
                handleClose();
                alert(priceType.toLowerCase() === 'market' ? "Order completed successfully" : "Order placed successfully");
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            alert('Something went wrong');
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack sx={{
                    background: orderType.toLowerCase() === 'buy' ? '#396dff' : '#d43725',
                    p: 2
                }} >
                    <Typography sx={{
                        color: '#fff',
                        fontWeight: '600'
                    }} >{orderType} {positionData?.symbol}</Typography>
                    <Typography sx={{
                        color: '#fff',
                        fontSize: '0.8rem'
                    }} >{positionData?.exchange}: ₹{positionData?.ltp}</Typography>
                </Stack>
                <Stack sx={{ px: 2, my: 2 }} >
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="MIS" control={<Radio onChange={handleProductType} color="blue" />} label="MIS" />
                            <FormControlLabel value="NRML" control={<Radio onChange={handleProductType} color="blue" />} label="NRML" />
                        </RadioGroup>
                    </FormControl>
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{
                            my: 2
                        }} >
                        <TextField
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmQty"
                            label="Qty (Lot Size 1)"
                            variant="outlined"
                            name="qty" />
                        <TextField
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmPrice"
                            label="Price (tick size 0.05)"
                            variant="outlined"
                            name="price"
                            disabled={priceType.toLowerCase() === 'market' ? true : false} />
                    </Stack>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="Market" control={<Radio onChange={handlePriceType} color="blue" />} label="Market" />
                            <FormControlLabel value="Limit" control={<Radio onChange={handlePriceType} color="blue" />} label="Limit" />
                        </RadioGroup>
                    </FormControl>
                </Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        background: '#d9d9d950',
                        p: 2
                    }} >
                    <Stack direction="row" alignItems="center" spacing={0.5} >
                        <Typography sx={{
                            color: 'grey',
                            fontSize: '0.9rem'
                        }} >Margin required: ₹{marginRequired} </Typography>
                        <RefreshIcon
                            sx={{
                                color: orderType.toLowerCase() === 'buy' ? '#396dff' : '#d43725',
                                width: '18px',
                                heigth: '18px',
                                cursor: 'pointer'
                            }} />
                    </Stack>
                    <Stack justifyContent="flex-end" direction="row" alignItems="center" spacing={1} >
                        <Button
                            onClick={handleOnOrder}
                            variant="contained"
                            color={orderType.toLowerCase() === 'buy' ? "blue" : "brand"}
                            sx={{
                                width: 80,
                                color: '#fff',
                                boxShadow: 'none',
                                '&:hover': {
                                    opacity: '0.9',
                                    boxShadow: 'none',
                                }
                            }} >{
                                loading ?
                                    <Loading color="#fff" /> :
                                    orderType
                            }</Button>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            sx={{
                                width: 100,
                                color: 'grey',
                                boxShadow: 'none',
                                border: '1px solid grey',
                                '&:hover': {
                                    opacity: '0.9',
                                    boxShadow: 'none',
                                    border: '1px solid grey',
                                }
                            }} >Cancel</Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
}