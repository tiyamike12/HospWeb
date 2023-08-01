import {Button, Card, CardBody, CardSubtitle, CardTitle, Col, Input, Row, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';
import {CSVLink} from "react-csv";

const BASE_URL = process.env.REACT_APP_API_URL;

const PatientList = () => {
    const [listData, setListData] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [dobFilter, setDobFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const csvHeaders = [
        {label: "Patient", key: "fullName"},
        {label: "Phone", key: "phone"},
        {label: "Email", key: "email"},
        {label: "Gender", key: "gender"},
        {label: "Date of Birth", key: "date_of_birth"},
        {label: "Physical Address", key: "physical_address"},

    ];
    useEffect(() => {
        axios.get(`${BASE_URL}/patients`)
            .then(response => {
                setData(response.data.data); // Set the patient data
                setCurrentPage(response.data.meta.current_page); // Set the current page
                setTotalPages(response.data.meta.last_page); // Set the total number of pages
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Function to navigate to the previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchPageData(currentPage - 1);
        }
    };

    // Function to navigate to the next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            fetchPageData(currentPage + 1);
        }
    };

    useEffect(() => {
        // Fetch data for the initial page when the component mounts
        fetchPageData(currentPage);
    }, [currentPage]);

    const fetchPageData = (page) => {
        axios.get(`${BASE_URL}/patients?page=${page}`)
            .then(response => {
                setData(response.data.data);
                setCurrentPage(response.data.meta.current_page);
                setTotalPages(response.data.meta.last_page);
            })
            .catch(error => console.log(error));
    };

    const filteredListData = data.filter((patient) => {
        const fullName = `${patient.firstname} ${patient.surname}`.toLowerCase();
        const genderMatch = !genderFilter || patient.gender === genderFilter;
        const dobMatch = !dobFilter || patient.date_of_birth === dobFilter;
        return fullName.includes(searchQuery.toLowerCase()) && genderMatch && dobMatch;
    });

    const csvData = filteredListData.map((tdata) => {
        return {
            fullName: `${tdata.firstname} ${tdata.surname}`,
            phone: tdata.phone,
            email: tdata.email,
            gender: tdata.gender,
            date_of_birth: tdata.date_of_birth,
            physical_address: tdata.physical_address,
        };
    });

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/patients/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('Patient removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Patient removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(listData)

    return (
        <div>
            <Row className="mb-3">
                <Col xs="4">
                    <Input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        className="col-4 mr-2"
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col xs="4">
                    <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="form-select col-3 mr-2"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </Col>
                <Col xs="4">
                    <Input
                        type="date"
                        placeholder="Date of Birth"
                        value={dobFilter}
                        onChange={(e) => setDobFilter(e.target.value)}
                    />
                </Col>

            </Row>

            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Patient Listing</CardTitle>
                        <Row className="mb-3">
                            <Col xs="12">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Link to={'/new-patient'} className="btn btn-primary">Add New Patient
                                            Record</Link>
                                    </div>
                                    <div>
                                        <Button color="success" className="ms-2 mb-2">
                                            <CSVLink
                                                data={csvData}
                                                headers={csvHeaders}
                                                filename={"patient_data.csv"}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "white"
                                                }} // Add this line to remove the underline
                                            >
                                                Export CSV
                                            </CSVLink>
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Patients
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Phone</th>

                                <th>Email</th>
                                <th>Gender</th>

                                <th>Date of Birth</th>
                                <th>Physical Address</th>

                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {filteredListData.map((tdata) => (

                                <tr key={tdata.id} className="border-top">
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <div>
                                                <h6 className="mb-0">{tdata.firstname} {tdata.surname}</h6>
                                                <span className="text-muted">{tdata.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{tdata.phone}</td>
                                    <td>{tdata.email}</td>
                                    <td>{tdata.gender}</td>
                                    <td>{tdata.date_of_birth}</td>

                                    <td>{tdata.physical_address}</td>
                                    <td><Link to={`/edit-patient/${tdata.id}`}
                                              className="btn btn-outline-primary">Edit</Link></td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => {
                                            setSelectedItemId(tdata.id);
                                            setShowModal(true);
                                        }}>
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-outline-primary mx-2"
                                disabled={currentPage === 1}
                                onClick={handlePreviousPage}
                            >
                                &laquo; Previous
                            </button>
                            <span className="mx-2">Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn btn-outline-primary mx-2"
                                disabled={currentPage === totalPages}
                                onClick={handleNextPage}
                            >
                                Next &raquo;
                            </button>
                        </div>
                    </CardBody>


                </Card>) : (<p>Loading...</p>)}

            <Modal show={showModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this patient?</Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-outline-light" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn btn-danger" role="button" onClick={handleDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Alert stack={{limit: 5}}/>

        </div>
    )
}

export default PatientList;