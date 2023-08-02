import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
const BASE_URL = process.env.REACT_APP_API_URL;

const AppointmentsOverallChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: "pie",
            },
            labels: ["Scheduled", "Completed", "Canceled"],
            colors: ["#36A2EB", "#FF6384", "#FFCE56"],
        },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from the API to get the statistics
        axios.get(`${BASE_URL}/appointments/overall-statistics`)
            .then(response => {
                const { scheduled, completed, canceled } = response.data;
                setChartData((prevChartData) => ({
                    ...prevChartData,
                    series: [scheduled, completed, canceled],
                }));
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);

            });
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>Appointments Statistics</h2>
            <Chart options={chartData.options} series={chartData.series} type="pie" width={400} />
        </div>
    );
};

export default AppointmentsOverallChart;
