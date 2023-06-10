import { Box } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Loading from '../../components/loading/Loading';
import { useLocation } from 'react-router-dom';

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
  
    // Add leading zeros to month and day if necessary
    const monthString = month.toString().padStart(2, '0');
    const dayString = day.toString().padStart(2, '0');
  
    // Format the date string as yyyy-mm-dd
    const dateString = `${year}-${monthString}-${dayString}`;
  
    return dateString;
  }

  function getDateXDaysAgo(numDays) {
    const today = new Date();
    const pastDate = new Date(today.getTime() - numDays * 24 * 60 * 60 * 1000);
    const year = pastDate.getFullYear();
    const month = pastDate.getMonth() + 1;
    const day = pastDate.getDate();
  
    // Add leading zeros to month and day if necessary
    const monthString = month.toString().padStart(2, '0');
    const dayString = day.toString().padStart(2, '0');
  
    // Format the date string as yyyy-mm-dd
    const dateString = `${year}-${monthString}-${dayString}`;
  
    return dateString;
  }
  
  

function TradingChart() {
    const [data, setData] = useState([]);
    const [timeFrame, setTimeFrame] = useState('5');
    const [fromDate, setFromDate] = useState(getDateXDaysAgo(0));
    const [toDate, setToDate] = useState(getCurrentDate());
    const location = useLocation();
    const scrip = new URLSearchParams(location.search).get('symbol');
    const [loading, setLoading] = useState(false);

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            },
        },
        title: {
            text: 'Candlestick Chart',
            align: 'left',
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH:mm',
                }
            }
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
        },
        annotations: {
            xaxis: [{
                x: new Date().getTime(),
                borderColor: '#999',
                label: {
                    borderColor: '#999',
                    style: {
                        fontSize: '12px',
                        color: '#fff',
                        background: '#999',
                    },
                    text: 'Today',
                }
            }]
        }
    };
    

    const series = [
        {
            name: `Candlestick Chart - 5`,
            data: data.map((d) => [
                new Date(d.time).getTime(),
                d.open,
                d.high,
                d.low,
                d.close,
            ]),
        },
    ];

    const getHistoricalScripData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/historical/get?scrip=${scrip}&timeFrame=${timeFrame}&fromDate=${fromDate}&toDate=${toDate}`
            );
            if (response.status === 200) {
                let allData = [];
                response.data.data.candles.map((candle) => {
                    allData.push(
                        {
                            time: new Date(candle[0]).getTime(),
                            open: candle[1],
                            high: candle[2],
                            low: candle[3],
                            close: candle[4],
                        }
                    )
                });
                setLoading(false);
                setData(allData);
            }
        } catch (err) {
            console.log(err);
            // alert('Something went wrong');
            setLoading(false);
        }
    };

    useEffect(() => {
        getHistoricalScripData();
    }, [scrip]);


    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            {
                loading ?
                    <Loading /> :
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="candlestick"
                        height={500}
                    />
            }
        </Box>
    );
}

export default TradingChart;
