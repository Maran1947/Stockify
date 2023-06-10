import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'

const getRoundFloat = (num) => { return Math.round(num, 2) };

function Tools() {

    const [buyMargin, setBuyMargin] = useState(5000);
    const [sellMargin, setSellMargin] = useState(5000);

    const [buyLeverage, setBuyLeverage] = useState(5);
    const [sellLeverage, setSellLeverage] = useState(5);

    const [buyEntryPrice, setBuyEntryPrice] = useState(1000.5);
    const [sellEntryPrice, setSellEntryPrice] = useState(1000.5);

    const [buyRisk, setBuyRisk] = useState(10);
    const [sellRisk, setSellRisk] = useState(10);

    const [buyReward, setBuyReward] = useState(2);
    const [sellReward, setSellReward] = useState(2);

    const [buyQty, setBuyQty] = useState((buyLeverage * buyMargin) / buyEntryPrice);
    const [sellQty, setSellQty] = useState((sellLeverage * sellMargin) / sellEntryPrice);

    const [buyStopLoss, setBuyStopLoss] = useState(buyEntryPrice - buyRisk);
    const [sellStopLoss, setSellStopLoss] = useState(sellEntryPrice + sellRisk);

    const [buyTarget, setBuyTarget] = useState(buyEntryPrice + (buyRisk * buyReward));
    const [sellTarget, setSellTarget] = useState(sellEntryPrice - (sellRisk * sellReward));

    const [buyGain, setBuyGain] = useState(Math.floor(buyQty) * (buyTarget - buyEntryPrice));
    const [sellGain, setSellGain] = useState(Math.floor(sellQty) * (sellEntryPrice - sellTarget));

    const [buyLoss, setBuyLoss] = useState(Math.floor(buyQty) * (buyEntryPrice - buyStopLoss));
    const [sellLoss, setSellLoss] = useState(Math.floor(sellQty) * (sellStopLoss - sellEntryPrice));

    const handleBuyRefresh = () => {
        setBuyQty(() => (buyLeverage * buyMargin) / buyEntryPrice);
        setBuyStopLoss(() => buyEntryPrice - buyRisk);
        setBuyTarget(() => parseFloat(buyEntryPrice) + (buyRisk * buyReward));
        setBuyGain(() => Math.floor(buyQty) * (buyTarget - buyEntryPrice));
        setBuyLoss(() => Math.floor(buyQty) * (buyEntryPrice - buyStopLoss))
    }

    const handleSellRefresh = () => {
        setSellQty(() => (sellLeverage * sellMargin) / sellEntryPrice);
        setSellStopLoss(() => sellEntryPrice - sellRisk);
        setSellTarget(() => parseFloat(sellEntryPrice) + (sellRisk * sellReward));
        setSellGain(() => Math.floor(sellQty) * (sellTarget - sellEntryPrice));
        setSellLoss(() => Math.floor(sellQty) * (sellEntryPrice - sellStopLoss))
    }

    return (
        <Box>
            <Typography variant="h5" sx={{
                mb: 4
            }} >Risk Management Tool</Typography>
            <Stack spacing={10} direction="row" >
                <Stack sx={{
                    width: '50%',
                }} >
                    <Stack sx={{
                        background: "#3869e7",
                        p: 2
                    }} >
                        <Typography sx={{
                            color: '#fff',
                            fontSize: '1.2rem',
                            fontWeight: '600'
                        }} >BUY</Typography>
                    </Stack>
                    <Stack spacing={2} sx={{
                        background: "#ff000010",
                        p: 2
                    }}>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={buyMargin}
                                onChange={(e) => setBuyMargin(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Available margin"
                                variant="outlined" />
                            <TextField
                                value={buyLeverage}
                                onChange={(e) => setBuyLeverage(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Leverage"
                                variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={buyEntryPrice}
                                onChange={(e) => setBuyEntryPrice(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Entry Price"
                                variant="outlined" />
                            <TextField
                                value={buyRisk}
                                onChange={(e) => setBuyRisk(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Risk ( in pts )"
                                variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={buyReward}
                                onChange={(e) => setBuyReward(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Reward ( in RR ratio )"
                                variant="outlined" />
                            <TextField
                                value={Math.floor(buyQty)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Qty"
                                variant="outlined"
                                contentEditable={false} />
                        </Stack>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={buyStopLoss}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Stop Loss"
                                variant="outlined"
                                contentEditable={false} />
                            <TextField
                                value={buyTarget}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Target"
                                contentEditable={false}
                                variant="outlined" />
                        </Stack>
                        <Stack>
                            <Stack direction="row">
                                <Typography sx={{
                                    background: '#188038',
                                    color: '#fff',
                                    fontWeight: '700',
                                    width: '30%',
                                    p: 1
                                }} >Gain</Typography>
                                <Typography sx={{
                                    background: '#18803870',
                                    color: '#188038',
                                    fontWeight: '700',
                                    width: '70%',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    p: 1
                                }} >₹{getRoundFloat(buyGain)} /-</Typography>
                            </Stack>
                            <Stack direction="row">
                                <Typography sx={{
                                    background: '#ff0000',
                                    color: '#fff',
                                    fontWeight: '700',
                                    width: '30%',
                                    p: 1
                                }} >Loss</Typography>
                                <Typography sx={{
                                    background: '#ff000070',
                                    color: '#ff0000',
                                    fontWeight: '700',
                                    width: '70%',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    p: 1
                                }} >₹{getRoundFloat(buyLoss)} /-</Typography>
                            </Stack>
                        </Stack>
                        <Stack sx={{
                            width: '100%',
                        }}
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center" >
                            <Button
                                onClick={handleBuyRefresh}
                                sx={{
                                    width: '25%',
                                    color: '#d43725',
                                    background: 'transparent',
                                    border: '1px solid #d43725',
                                    mt: 2
                                }} >Refresh</Button>
                        </Stack>
                    </Stack>

                </Stack>
                <Stack sx={{
                    width: '50%',
                }} >
                    <Stack sx={{
                        background: "#d43725",
                        p: 2
                    }} >
                        <Typography sx={{
                            color: '#fff',
                            fontSize: '1.2rem',
                            fontWeight: '600'
                        }} >SELL</Typography>
                    </Stack>
                    <Stack spacing={2} sx={{
                        background: "#ff000010",
                        p: 2
                    }} >
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={sellMargin}
                                onChange={(e) => setSellMargin(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Available margin"
                                variant="outlined" />
                            <TextField
                                value={sellLeverage}
                                onChange={(e) => setSellLeverage(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Leverage"
                                variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={sellEntryPrice}
                                onChange={(e) => setSellEntryPrice(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Entry Price"
                                variant="outlined" />
                            <TextField
                                value={sellRisk}
                                onChange={(e) => setSellRisk(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Risk ( in pts )"
                                variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={sellReward}
                                onChange={(e) => setSellReward(e.target.value)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Reward ( in RR ratio )"
                                variant="outlined" />
                            <TextField
                                value={Math.floor(sellQty)}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Qty"
                                variant="outlined"
                                contentEditable={false} />
                        </Stack>
                        <Stack direction="row" spacing={1} >
                            <TextField
                                value={sellStopLoss}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Stop Loss"
                                variant="outlined"
                                contentEditable={false} />
                            <TextField
                                value={sellTarget}
                                sx={{
                                    width: '80%'
                                }}
                                color="secondary"
                                id="outlined-basic"
                                label="Target"
                                variant="outlined"
                                contentEditable={false} />
                        </Stack>
                        <Stack>
                            <Stack direction="row">
                                <Typography sx={{
                                    background: '#188038',
                                    color: '#fff',
                                    fontWeight: '700',
                                    width: '30%',
                                    p: 1
                                }} >Gain</Typography>
                                <Typography sx={{
                                    background: '#18803870',
                                    color: '#188038',
                                    fontWeight: '700',
                                    width: '70%',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    p: 1
                                }} >₹{Math.round(sellGain)} /-</Typography>
                            </Stack>
                            <Stack direction="row">
                                <Typography sx={{
                                    background: '#ff0000',
                                    color: '#fff',
                                    fontWeight: '700',
                                    width: '30%',
                                    p: 1
                                }} >Loss</Typography>
                                <Typography sx={{
                                    background: '#ff000070',
                                    color: '#ff0000',
                                    fontWeight: '700',
                                    width: '70%',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    p: 1
                                }} >₹{Math.round(sellLoss)} /-</Typography>
                            </Stack>
                        </Stack>
                        <Stack sx={{
                            width: '100%',
                        }}
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center" >
                            <Button
                                onClick={handleSellRefresh}
                                sx={{
                                    width: '25%',
                                    color: '#d43725',
                                    background: 'transparent',
                                    border: '1px solid #d43725',
                                    mt: 2
                                }} >Refresh</Button>
                        </Stack>
                    </Stack>

                </Stack>
            </Stack>
        </Box>
    )
}

export default Tools;