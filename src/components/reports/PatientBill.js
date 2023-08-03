import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';
import { CSVLink } from "react-csv";
import Select from 'react-select';

const BASE_URL = process.env.REACT_APP_API_URL;

const PatientBill = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const csvHeaders = [
        { label: "Patient", key: "patientName" },
        { label: "Bill Date", key: "billing_date" },
        { label: "Amount (MK)", key: "amount" },
        { label: "Insurance Provider", key: "insurance_provider" },
        { label: "Payment Status", key: "payment_status" },
    ];

    useEffect(() => {
        fetchBillingRecords(currentPage);
    }, [currentPage]);

    const fetchBillingRecords = (page) => {
        setIsLoaded(false);
        axios.get(`${BASE_URL}/billings/outstanding?page=${page}`)
            .then(response => {
                setListData(response.data.data);
                setTotalPages(response.data.meta.last_page);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    };


    const csvData = listData.map((tdata) => {
        return {
            patientName: `${tdata.patient.firstname} ${tdata.patient.surname}`,
            billing_date: tdata.billing_date,
            amount: tdata.amount,
            insurance_provider: tdata.insurance_provider ? tdata.insurance_provider.provider_name : "No Insurance Provider",
            payment_status: tdata.payment_status,
        };
    });

    const handlePaginationPrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePaginationNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };


    console.log(listData)
    return (
        <div>
            {isLoaded ? (
                <Card>
                    <CardBody>
                        <CardTitle tag="h5">Outstanding Bills</CardTitle>

                        <Row>
                            <Col>
                        <Button color="success" className="ms-2">
                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={"billing_data.csv"}
                                style={{ textDecoration: "none", color: "white"  }}
                            >
                                Export CSV
                            </CSVLink>
                        </Button>
                                <Button color="primary" className="ms-2">
                                    <Link to={'/patient-bill-options'} className="btn btn-sm btn-primary">
                                        Custom Reports</Link>
                                </Button>
                            </Col>
                        </Row>
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
                            {listData.map((tdata) => (
                                <tr key={tdata.id} className="border-top">
                                    <td>{tdata.patient.firstname} {tdata.patient.surname}</td>
                                    <td>{tdata.billing_date}</td>
                                    <td>{tdata.amount}</td>
                                    <td>
                                        {tdata.insurance_provider ? (
                                            <>
                                                <p>{tdata.insurance_provider.provider_name}</p>
                                                <p>{tdata.insurance_provider.contact_information}</p>
                                            </>
                                        ) : (
                                            <p>No Insurance Provider</p>
                                        )}
                                    </td>
                                    <td>{tdata.payment_status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center mt-3">
                            <Button className="btn btn-primary me-2" onClick={handlePaginationPrev} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <Button className="btn btn-primary" onClick={handlePaginationNext} disabled={currentPage === totalPages}>
                                Next
                            </Button>
                        </div>
                    </CardBody>
                </Card> ) : (<p>Loading...</p>)}

            <Alert stack={{ limit: 5 }} />

        </div>
    )
}

export default PatientBill;
