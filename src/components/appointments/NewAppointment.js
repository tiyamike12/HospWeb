import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function NewAppointment() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const [appointment, setAppointment] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        purpose: '',
    });

    useEffect(() => {
        axios.get(`${BASE_URL}/doctors`)
            .then(response => setDoctors(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/patients`)
            .then(response => setPatients(response.data))
            .catch(error => console.log(error));
    }, []);
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/appointments`, appointment)
                .then(res => toast.success("Appointment Record created successfully"));
            navigate('/appointments');
            Alert.success('Appointment Record added successfully!');

        } catch (error) {
            if (error.response.status === 422) {
                console.log(error.response.data.message);
                console.log("Errors happening here hehehe")
            } else {
                console.error(error)
            }
            //console.log(error);
        }

        setIsLoading(false)
        setDisable(false)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                        Create an Appointment
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="doctor_id">Select Doctor</Label>
                                <select id="doctor_id" name="doctor_id"
                                        className="form-control"
                                        value={appointment.doctor_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.firstname} {doctor.lastname}</option>
                                    ))}
                                </select>
                                {/*{user.errors.role_id && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.role_id}</span>}*/}

                            </FormGroup>

                            <FormGroup>
                                <Label for="patient_id">Select Patient</Label>
                                <select id="patient_id" name="patient_id"
                                        className="form-control"
                                        value={appointment.patient_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>{patient.firstname} {patient.surname}</option>
                                    ))}
                                </select>
                                {/*{user.errors.role_id && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.role_id}</span>}*/}

                            </FormGroup>
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



                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Add Patient&emsp;
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

export default NewAppointment;
