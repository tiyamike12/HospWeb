import {Button, Card, CardBody, CardSubtitle, CardTitle, Col, Input, Row, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const AppointmentList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAppointments(currentPage);
    }, [currentPage]);

    const fetchAppointments = (page) => {
        axios.get(`${BASE_URL}/appointments?page=${page}`)
            .then(response => {
                setListData(response.data.data);
                setTotalPages(response.data.meta.last_page);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    };

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/appointments/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('appointment removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Appointments removed successfully!');

            })
            .catch(error => console.log(error));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Function to filter the patient list based on the search query
    const filteredListData = listData.filter((appointment) => {
        const doctorFullName = `${appointment.person.firstname} ${appointment.person.lastname}`.toLowerCase();
        const patientFullName = `${appointment.patient.firstname} ${appointment.patient.surname}`.toLowerCase();
        return (
            doctorFullName.includes(searchQuery.toLowerCase()) ||
            patientFullName.includes(searchQuery.toLowerCase())
        );
    });


    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
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

            </Row>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Appointments Listing</CardTitle>
                        <Row className="mb-3">
                            <Col xs="12">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Link to={'/appointments-calendar'} className="btn btn-primary">Appointments Calendar</Link>
                                    </div>
                                    <div>
                                        <Link to={'/new-appointment'} className="btn btn-primary">Add New Appointment Record</Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Appointments
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Patient</th>
                                <th>Appointment Date</th>
                                <th>Time</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {filteredListData.map((tdata) => (
                                <tr key={tdata.id} className="border-top">
                                    <td>{tdata.person.firstname} {tdata.person.lastname}</td>
                                    <td>{tdata.patient.firstname} {tdata.patient.surname}</td>
                                    <td>{tdata.appointment_date}</td>
                                    <td>{tdata.appointment_time}</td>

                                    <td>{tdata.purpose}</td>
                                    <td>{tdata.status}</td>
                                    <td><Link to={`/edit-appointment/${tdata.id}`}
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
                    <Modal.Title>Remove Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this appointment?</Modal.Body>
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

export default AppointmentList;