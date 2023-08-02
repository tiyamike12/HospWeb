import React, {useEffect, useState} from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import {Card, CardBody, CardTitle} from "reactstrap";

const BASE_URL = process.env.REACT_APP_API_URL;

const BillingChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Fetch billing data from your API
        axios
            .get(`${BASE_URL}/billings/chart-analysis`)
            .then((response) => {
                const data = response.data;
                console.log(data)
                setChartData(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Process data to extract required series for the chart
    // Extract data for each payment status (paid, pending, rejected) and months
    const paidData = chartData.map((dataPoint) => Number(dataPoint.paid));
    const pendingData = chartData.map((dataPoint) => Number(dataPoint.pending));
    const rejectedData = chartData.map((dataPoint) => Number(dataPoint.rejected));
    const months = chartData.map((dataPoint) => dataPoint.month);

    // Configure the chart options
    const options = {
        xaxis: {
            categories: months,
        },
        colors: ["#33FF9F", "#FF5733", "#3380FF"], // Change colors as needed
        fill: {
            opacity: 0.8,
        },
        legend: {
            position: "top",
        },
    };


    return chartData.length === 0 ? (
        <div>Loading...</div>
    ) : (
        <Card>
            <CardBody>
                <CardTitle tag="h5">Billings Overall</CardTitle>
                <ApexCharts
                    options={options}
                    series={[
                        {
                            name: "Paid",
                            data: paidData,
                        },
                        {
                            name: "Pending",
                            data: pendingData,
                        },
                        {
                            name: "Rejected",
                            data: rejectedData,
                        },
                    ]}
                    type="area"
                    height={390}
                    width="100%"

                />
            </CardBody>
        </Card>
    );
};

export default BillingChart;
