import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table} from "reactstrap";
import { CSVLink } from "react-csv";
const BASE_URL = process.env.REACT_APP_API_URL;

const PatientOutstandingBills = ({ patientId }) => {
    const [outstandingBills, setOutstandingBills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [csvData, setCsvData] = useState([]);

    const csvHeaders = [
        { label: "Patient", key: "patientName" },
        { label: "Bill Date", key: "billing_date" },
        { label: "Amount (MK)", key: "amount" },
        { label: "Insurance Provider", key: "insurance_provider" },
        { label: "Payment Status", key: "payment_status" },
    ];

    useEffect(() => {
        fetchOutstandingBills();
    }, [patientId]);

    const fetchOutstandingBills = () => {
        setIsLoading(true);
        axios.get(`${BASE_URL}/billings/patient/${patientId}`)
            .then(response => {
                // Handle the response for patient billing data
                // For example, set the outstandingBills state with the response data
                setOutstandingBills(response.data);
                setIsLoading(false);

                const csvData = response.data.map((bill) => ({
                    patientName: `${bill.patient.firstname} ${bill.patient.surname}`,
                    billing_date: bill.billing_date,
                    amount: bill.amount,
                    insurance_provider: bill.insurance_provider
                        ? bill.insurance_provider.provider_name
                        : "No Insurance Provider",
                    payment_status: bill.payment_status,
                }));
                setCsvData(csvData);

            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    };

    return (
        <div>
            {/*<CSVLink data={csvData} filename={"outstanding_bills.csv"}>*/}
            {/*    Export to CSV*/}
            {/*</CSVLink>*/}

            <Button color="success" className="ms-2 mb-2">
                <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={"outstanding_bills.csv"}
                    style={{ textDecoration: "none", color: "white"  }} // Add this line to remove the underline
                >
                    Export CSV
                </CSVLink>
            </Button>
            {/* Display the outstanding bills here */}
            {isLoading ? <p>Loading...</p> : (
                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Bill Date</th>
                        <th>Amount (MK)</th>
                        <th>Insurance Provider</th>
                        <th>Payment Status</th>

                    </tr>
                    </thead>
                    <tbody>
                    {outstandingBills.map((bill) => (
                        <tr key={bill.id}>
                            {/* Display each bill's data here */}
                            <td>{bill.patient.firstname} {bill.patient.surname}</td>
                            <td>{bill.billing_date}</td>
                            <td>{bill.amount}</td>
                            <td>{bill.insurance_provider.provider_name}</td>
                            <td>{bill.payment_status}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default PatientOutstandingBills;
