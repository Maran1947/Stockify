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
import { Typography } from '@mui/material';

function createData(orderId, time, symbol, exchange, orderType, qty, avg, tradeType, lmType, status) {

  let date = new Date(time);
  time = date.getHours() + ':' + (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()) + ':' + date.getSeconds();
  orderType = orderType.toUpperCase();
  status = status.toUpperCase();

  return { orderId, time, symbol, exchange, orderType, qty, avg, tradeType, lmType, status };
}

export default function OrdersTable({ status, refresh, setRefresh }) {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    const userId = JSON.parse(localStorage.getItem('cmUser')).userid;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/order/all?userId=${userId}&status=${status}`);
      if (response.status === 200) {
        setLoading(false);
        setRefresh(false);
        let allOrders = [];
        response.data.orders.map((order) => {
          allOrders.push(createData(
            order._id,
            order.createdAt,
            order.scripId.symbol,
            order.scripId.exchange,
            order.orderType,
            order.qty,
            order.price,
            order.productType,
            order.priceType,
            order.orderStatus
          ));
        });
        setOrders(allOrders);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (refresh) getOrders();
  }, [refresh]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="right">Order type</TableCell>
            <TableCell align="right">Symbol</TableCell>
            <TableCell align="right">Exchange</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Avg</TableCell>
            <TableCell align="right">Product type</TableCell>
            <TableCell align="right">Price type</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            loading ?
              <Loading /> :
              orders.length > 0 ?
                orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {order.time}
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{
                        background: order.orderType.toLowerCase() === 'buy' ? '#5a55ff20' : '#d4372520',
                        color: order.orderType.toLowerCase() === 'buy' ? '#5a55ff' : '#d43725',
                        textAlign: 'center',
                        borderRadius: '5px',
                        fontSize: '0.9rem',
                        padding: '0.2rem 0.5rem'
                      }} >{order.orderType}</Typography>
                    </TableCell>
                    <TableCell align="right">{order.symbol}</TableCell>
                    <TableCell align="right">{order.exchange}</TableCell>
                    <TableCell sx={{
                      color: order.orderType.toLowerCase() === 'buy' ? '#5a55ff' : '#d43725'
                    }} align="right">{order.qty}</TableCell>
                    <TableCell align="right">{order.avg}</TableCell>
                    <TableCell align="right">{order.tradeType}</TableCell>
                    <TableCell align="right">{order.lmType}</TableCell>
                    <TableCell align="left">
                      <Typography sx={{
                        background: order.status.toLowerCase() === 'executed' ? '#23d16020' : '#d4372520',
                        color: order.status.toLowerCase() === 'executed' ? '#23d160' : '#d43725',
                        textAlign: 'center',
                        borderRadius: '5px',
                        fontSize: '0.9rem',
                        padding: '0.2rem 0.5rem'
                      }} >{order.status}</Typography>
                    </TableCell>
                  </TableRow>
                )) :
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    No orders
                  </TableCell>
                </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}