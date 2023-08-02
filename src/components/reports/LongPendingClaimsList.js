import {Button, Card, CardBody, CardSubtitle, CardTitle, Col, Form, FormGroup, Input, Row, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';
import { CSVLink } from "react-csv";

const BASE_URL = process.env.REACT_APP_API_URL;

const LongPendingClaimsList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [patientFilter, setPatientFilter] = useState("");
    const [providerFilter, setProviderFilter] = useState("");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
    const paymentStatusOptions = ["", "pending", "rejected", "paid", "cancelled"];

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
        axios.get(`${BASE_URL}/billings/overdue-claims?page=${page}`)
            .then(response => {
                setListData(response.data.data);
                setTotalPages(response.data.last_page);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    };

    // Handle filter changes
    const handlePatientFilterChange = (e) => {
        setPatientFilter(e.target.value);
    };

    const handleProviderFilterChange = (e) => {
        setProviderFilter(e.target.value);
    };

    const handlePaymentStatusFilterChange = (e) => {
        setPaymentStatusFilter(e.target.value);
    };

    // Apply filters to the list data
    const filteredList = listData.filter((tdata) => {
        const patientName = `${tdata.patient.firstname} ${tdata.patient.surname}`.toLowerCase();
        const providerName = tdata.insurance_provider ? tdata.insurance_provider.provider_name.toLowerCase() : "";
        const paymentStatus = tdata.payment_status.toLowerCase();

        return (
            patientName.includes(patientFilter.toLowerCase()) &&
            providerName.includes(providerFilter.toLowerCase()) &&
            (paymentStatusFilter === "" || paymentStatus.includes(paymentStatusFilter.toLowerCase()))
        );
    });

    const csvData = filteredList.map((tdata) => {
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
    const handleClearFilters = () => {
        setPatientFilter("");
        setProviderFilter("");
        setPaymentStatusFilter("");
        setCurrentPage(1);
    };
    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Overdue Pending Claims</CardTitle>

                        <Form className="mb-3">
                            <Row className="align-items-end">
                                {/* Patient Filter */}
                                <Col md="4">
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="patientFilter"
                                            value={patientFilter}
                                            onChange={handlePatientFilterChange}
                                            placeholder="Search by patient"
                                        />
                                    </FormGroup>
                                </Col>

                                {/* Provider Filter */}
                                <Col md="4">
                                    <FormGroup className="me-3 mb-2">
                                        <Input
                                            type="text"
                                            name="providerFilter"
                                            value={providerFilter}
                                            onChange={handleProviderFilterChange}
                                            placeholder="Search by insurance provider"
                                        />
                                    </FormGroup>
                                </Col>

                            </Row>

                            {/* Clear Filters Button */}
                            <Button color="primary" onClick={handleClearFilters} className="mb-2">
                                Clear Filters
                            </Button>

                            <Button color="success" className="ms-2 mb-2">
                                <CSVLink
                                    data={csvData}
                                    headers={csvHeaders}
                                    filename={"pending_claims_data.csv"}
                                    style={{ textDecoration: "none", color: "white"  }} // Add this line to remove the underline
                                >
                                    Export CSV
                                </CSVLink>
                            </Button>
                        </Form>

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
                            {filteredList.map((tdata) => (
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
                                    <td><span className="badge rounded-pill bg-danger">{tdata.payment_status}</span>
                                        </td>


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

export default LongPendingClaimsList;