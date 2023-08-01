import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
import Select from "react-select";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditAppointment() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [appointment, setAppointment] = useState({
        patient_id: '',
        user_id: '',
        appointment_date: '',
        appointment_time: '',
        purpose: '',
        status: ''
    });

    const [statusOptions] = useState([
        'scheduled',
        'in progress',
        'completed',
        'canceled',
    ]);

    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/doctors`)
            .then(response => setDoctors(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        const fetchPatientsByPage = (page) => {
            setIsLoading(true);
            axios.get(`${BASE_URL}/patients?page=${page}`)
                .then(response => {
                    const formattedPatients = response.data.data.map(patient => ({
                        value: patient.id,
                        label: `${patient.firstname} ${patient.surname}`,
                    }));
                    setPatients(prevPatients => [...prevPatients, ...formattedPatients]);
                    setTotalPages(response.data.meta.last_page);
                    setCurrentPage(page);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setIsLoading(false);
                });
        };

        fetchPatientsByPage(currentPage);
    }, [currentPage]);

    const handlePatientChange = (selectedOption) => {
        setSelectedPatient(selectedOption);
        setAppointment(prevState => ({
            ...prevState,
            patient_id: selectedOption ? selectedOption.value : '', // Set the selected patient's ID
        }));
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/appointments/${id}`)
            .then(response => {
                const appointmentData = response.data;
                setAppointment({
                    patient_id: appointmentData.patient_id,
                    user_id: appointmentData.user_id,
                    appointment_date: appointmentData.appointment_date,
                    appointment_time: appointmentData.appointment_time,
                    purpose: appointmentData.purpose,
                    status: appointmentData.status,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/appointments/${id}`, appointment);
            Alert.success('Appointment updated successfully!');
            navigate('/appointments');
        } catch (error) {
            if (error.response) {
                const responseData = error.response.data;

                if (error.response.status === 422) {
                    // Handle validation errors
                    if (responseData.errors) {
                        displayValidationErrors(responseData.errors);
                    } else {
                        console.log('Validation error occurred:', responseData.message);
                        console.log('Default validation error message:', responseData.message);
                    }
                } else if (error.response.status === 401) {
                    handleUnauthorizedError(responseData.message);
                } else if (error.response.status === 500) {
                    console.error(error)
                    handleInternalServerError(responseData.message);
                } else {
                    // Handle other errors with unknown status codes
                    handleOtherError();
                }
            } else {
                // Handle errors without response data (network errors, etc.)
                handleNetworkError();
            }
            //console.log(error);
        }

        setIsLoading(false)
        setDisable(false)
    };

    const displayValidationErrors = (errors) => {
        for (const errorField in errors) {
            const errorMessage = errors[errorField].join('\n');
            toast.error(errorMessage);
        }
    };

    // Function to handle unauthorized errors
    const handleUnauthorizedError = (message) => {
        toast.error('Unauthorized: Please log in again.');
        // Redirect to login page or handle unauthorized error as needed
    };

    // Function to handle internal server errors
    const handleInternalServerError = (message) => {
        toast.error('Internal Server Error: Please try again later.');
        // Handle internal server error as needed
    };

    // Function to handle other errors with unknown status codes
    const handleOtherError = () => {
        toast.error('An unexpected error occurred. Please try again later.');
        // Handle other errors as needed
    };

    // Function to handle network errors (when no response data is available)
    const handleNetworkError = () => {
        toast.error('Network Error: Please check your internet connection and try again.');
        // Handle network error as needed
    };

    return (
        <Row>
            <Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Update Appointment
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>

                            <FormGroup>
                                <Label for="user_id">Select Doctor</Label>
                                <select id="user_id" name="user_id"
                                        className="form-control"
                                        value={appointment.user_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.person.firstname} {doctor.person.lastname}</option>
                                    ))}
                                </select>
                                {/*{user.errors.role_id && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.role_id}</span>}*/}

                            </FormGroup>

                            <FormGroup>
                                <Label for="patient_id">Select Patient</Label>
                                <Select
                                    id="patient_id"
                                    name="patient_id"
                                    options={patients}
                                    value={selectedPatient}
                                    onChange={handlePatientChange}
                                    placeholder="Please select a patient..."
                                    isSearchable
                                    isLoading={isLoading}
                                    onMenuScrollToBottom={() => {
                                        if (currentPage < totalPages) {
                                            setCurrentPage(currentPage + 1);
                                        }
                                    }}
                                />
                            </FormGroup>
                            {/*<FormGroup>*/}
                            {/*    <Label for="patient_id">Select Patient</Label>*/}
                            {/*    <select id="patient_id" name="patient_id"*/}
                            {/*            className="form-control"*/}
                            {/*            value={appointment.patient_id}*/}
                            {/*            onChange={handleChange}>*/}
                            {/*        <option value="">Please select a value</option>*/}
                            {/*        {patients.map(patient => (*/}
                            {/*            <option key={patient.id} value={patient.id}>{patient.firstname}</option>*/}
                            {/*        ))}*/}
                            {/*    </select>*/}

                            {/*</FormGroup>*/}
                            <FormGroup>
                                <Label for="appointment_date">Appointment Date</Label>
                                <Input
                                    id="appointment_date"
                                    name="appointment_date"
                                    placeholder="Appointment Date"
                                    type="date"
                                    value={appointment.appointment_date}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="appointment_time">Appointment Time</Label>
                                <Input
                                    id="appointment_time"
                                    name="appointment_time"
                                    placeholder="Appointment Time"
                                    type="time"
                                    value={appointment.appointment_time}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <FormGroup>
                                <Label for="purpose">Purpose</Label>
                                <Input
                                    id="purpose"
                                    name="purpose"
                                    placeholder="Purpose"
                                    type="text"
                                    value={appointment.purpose}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="status">Select Status</Label>
                                <select id="status" name="status"
                                        className="form-control"
                                        value={appointment.status}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Appointment&emsp;
                                {isLoading && <span className="spinner-border spinner-border-sm me-1"></span> }
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Alert stack={{ limit: 5 }} />

        </Row>

    );
}

export default EditAppointment;
