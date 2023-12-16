import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Loading from '../loading/Loading';

function createData(
    symbol,
    open,
    high,
    low,
    prevPrice,
    ltp,
    perChange,
    volume,
    value
) {

    value = value.toFixed(2);

    return {
        symbol,
        open,
        high,
        low,
        prevPrice,
        ltp,
        perChange,
        volume,
        value
    };
}

export default function GLTable({ type, refreshGL, setRefreshGL }) {

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getGL = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/analysis/gl`);
            if (response.status === 200) {
                const glResponseData = response.data;
                let glData;
                if ( glResponseData.gainers && type === 'gainers')
                    glData = glResponseData.gainers[0]['NIFTY'].data;
                if( glResponseData.losers && type === 'losers' )
                    glData = glResponseData.losers[0]['NIFTY'].data;

                glData = glData?.map((scrip) => {
                    return createData(
                        scrip.symbol,
                        scrip.open_price,
                        scrip.high_price,
                        scrip.low_price,
                        scrip.prev_price,
                        scrip.ltp,
                        scrip.perChange,
                        scrip.trade_quantity,
                        scrip.turnover)
                });
                setTableData(glData);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            alert('Something went wrong');
        }
    }

    const refreshGainerLosers = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/analysis/gl/save`);
            if(response.status === 200) {
                getGL();
                setRefreshGL(false);
            }
        } catch (err) {
            console.log(err);
            setRefreshGL(false);
            alert("Something went wrong");
        }
    }

    useEffect(() => {
        getGL();
    }, [type]);

    useEffect(() => {
        if (refreshGL) {
            refreshGainerLosers();
        }
    }, [refreshGL]);

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>SYMBOL</TableCell>
                        <TableCell align="right">OPEN</TableCell>
                        <TableCell align="right">HIGH</TableCell>
                        <TableCell align="right">LOW</TableCell>
                        <TableCell align="right">PREV. CLOSE</TableCell>
                        <TableCell align="right">LTP</TableCell>
                        <TableCell align="right" >%CHNG</TableCell>
                        <TableCell align="right">{`VOLUME (shares)`}</TableCell>
                        <TableCell align="right">{`VALUE (₹ Lakhs) `}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loading ?
                        <TableRow>
                            <TableCell>
                                <Loading />
                            </TableCell>
                        </TableRow>
                        : tableData && tableData.length > 0 ?
                            tableData.map((scrip) => (
                                <TableRow
                                    key={scrip.symbol}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell scope="row">{scrip.symbol}</TableCell>
                                    <TableCell scope="row">{scrip.open}</TableCell>
                                    <TableCell align="right">{scrip.high}</TableCell>
                                    <TableCell align="right">{scrip.low}</TableCell>
                                    <TableCell align="right">{scrip.prevPrice}</TableCell>
                                    <TableCell align="right">{scrip.ltp}</TableCell>
                                    <TableCell align="right" sx={{
                                        color: type === 'gainers' ? '#23d160' : '#ff0000'
                                    }} >{scrip.perChange}{"%"}</TableCell>
                                    <TableCell align="right">{scrip.volume}</TableCell>
                                    <TableCell align="right">{scrip.value}</TableCell>
                                </TableRow>
                            )) :
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell scope="row">No data found.</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}