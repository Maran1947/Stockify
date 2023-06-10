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
import { Button, Typography } from '@mui/material';
import ExitModal from '../modals/ExitModal';

function createData(posId, symbol, exchange, orderType, qty, avg, tradeType, lmType, ltp, pnl, posStatus) {

  orderType = orderType.toUpperCase();
  lmType = lmType.toUpperCase();

  return { posId, symbol, exchange, orderType, qty, avg, tradeType, lmType, ltp, pnl, posStatus };
}

export default function PositionsTable() {

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState('');
  const [positionData, setPositionData] = useState('');
  const [stock, setStock] = useState('');

  const getPositions = async () => {
    const userId = JSON.parse(localStorage.getItem('cmUser'))?.userid;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/position/all?userId=${userId}`);
      if (response.status === 200) {
        let allPositions = [];
        console.log('Positions: ', response.data.positions[0]?.buyOrderId?.scripId?.lastPrice);
        response.data?.positions?.map((position) => {
          allPositions.push(createData(
            position._id,
            position.buyOrderId.scripId.symbol,
            position.buyOrderId.scripId.exchange,
            position.buyOrderId.orderType,
            position.buyOrderId.qty,
            parseFloat(position.buyOrderId.price),
            position.buyOrderId.productType,
            position.buyOrderId.priceType,
            parseFloat(position.buyOrderId.scripId.lastPrice),
            (
              position.buyOrderId.orderType.toLowerCase() === 'buy' ?
                (parseFloat(position.buyOrderId.price) - parseFloat(position.buyOrderId.scripId.lastPrice)) * position.buyOrderId.qty :
                (parseFloat(position.buyOrderId.price) - parseFloat(position.buyOrderId.scripId.lastPrice)) * position.buyOrderId.qty * -1
            ),
            position.posStatus
          ));
        });
        setPositions(allPositions);
      }
    } catch (err) {
      console.log(err);
      // alert('Something went wrong');
    }
  }

  const handleExitPosition = (position) => {
    setOpen(true);
    setOrderType(position.orderType.toLowerCase() === 'buy' ? 'Sell' : 'Buy');
    setPositionData(position);
  }

  useEffect(() => {
    getPositions()
    setInterval(() => {
      getPositions();
    }, [5000]);
  }, []);


  return (
    <TableContainer component={Paper}>
      <ExitModal orderType={orderType} open={open} setOpen={setOpen} positionData={positionData} />
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Symbol</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Product type</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">B/S</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Exchange</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Price type</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Qty</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Avg</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Ltp</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">P&L</TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }} align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            loading ?
              <Loading /> :
              positions.length > 0 ?
                positions.map((position) => (
                  <TableRow
                    key={position.posId}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                        opacity: position.posStatus === 'Active' ? '1' : '0.6',
                        background: position.posStatus === 'Active'? '#fff' : '#c4c4cc70'
                    }}
                  >
                    <TableCell align="left">{position.symbol}</TableCell>
                    <TableCell align="left">{position.tradeType}</TableCell>
                    <TableCell align="left">
                      <Typography sx={{
                        background: position.orderType.toLowerCase() === 'buy' ? '#5a55ff20' : '#d4372520',
                        color: position.orderType.toLowerCase() === 'buy' ? '#5a55ff' : '#d43725',
                        textAlign: 'center',
                        borderRadius: '5px',
                        fontSize: '0.9rem',
                        padding: '0.2rem 0.5rem'
                      }} >{position.orderType}</Typography>
                    </TableCell>
                    <TableCell align="left">{position.exchange}</TableCell>
                    <TableCell align="left">{position.lmType}</TableCell>
                    <TableCell sx={{
                      color: position.orderType.toLowerCase() === 'buy' ? '#5a55ff' : '#d43725'
                    }} align="left">{position.qty}</TableCell>
                    <TableCell align="left">{position.avg}</TableCell>
                    <TableCell align="left">{position.ltp}</TableCell>
                    <TableCell align="left">{position.pnl}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        onClick={() => handleExitPosition(position)}
                        disabled={position.posStatus.toLowerCase() === 'active' ? false : true}
                        sx={{
                          fontSize: '0.8rem!important',
                          fontWeight: '600',
                          boxShadow: 'none',
                          background: 'transparent',
                          color: '#d43725',
                          border: position.posStatus.toLowerCase() === 'active' ? '1px solid #d43725' : 'none',
                          '&:hover': {
                            color: '#d43725',
                            boxShadow: 'none',
                            background: '#d43725',
                            color: '#fff',
                          }
                        }} >EXIT</Button>
                    </TableCell>
                  </TableRow>
                )) :
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">

                  </TableCell>
                  <TableCell component="th" scope="row">

                  </TableCell>
                  <TableCell component="th" scope="row">
                    No positions
                  </TableCell>
                </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}