import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import {Card, CardTitle} from "reactstrap";
import Chart from "react-apexcharts";

const BASE_URL = process.env.REACT_APP_API_URL;

const BillingTotalsBarChart = () => {
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'payment-status-bar',
                fontFamily: 'Roboto, sans-serif', // Change font family
                toolbar: {
                    show: false, // Hide the download toolbar
                },
            },
            colors: ['#F5A623', '#29B6F6', '#EF5350'], // Change colors
            xaxis: {
                categories: ['Pending', 'Paid', 'Rejected'],
            },
        },
        series: [
            {
                name: 'Amount',
                data: [0, 0, 0],
            },
        ],
    });


    useEffect(() => {
        axios.get(`${BASE_URL}/billings/payment-status-totals`)
            .then(response => {
                const {pending, paid, rejected} = response.data;

                const pendingAmount = parseFloat(pending);
                const paidAmount = parseFloat(paid);
                const rejectedAmount = parseFloat(rejected);
                setChartData({
                    options: {
                        chart: {
                            id: 'payment-status-bar',
                        },
                        xaxis: {
                            categories: ['Pending', 'Paid', 'Rejected'],
                        },
                    },
                    series: [
                        {
                            name: 'Amount',
                            data: [pendingAmount, paidAmount, rejectedAmount],
                        },
                    ],
                });
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <Card>
                <CardTitle tag="h5">Billing Totals</CardTitle>
                <Chart options={chartData.options} series={chartData.series} type="bar" width={400} />

            </Card>
        </div>
    );
};

export default BillingTotalsBarChart;
