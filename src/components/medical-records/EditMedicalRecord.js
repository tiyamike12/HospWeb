import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditMedicalRecord() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicalRecord, setMedicalRecord] = useState({
        patient_id: '',
        doctor_id: '',
        medical_notes: '',
        diagnoses: '',
        prescriptions: '',
        lab_results: ''
    });
    const { id } = useParams();

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

    useEffect(() => {
        axios.get(`${BASE_URL}/medical-records/${id}`)
            .then(response => {
                const medicalData = response.data;
                setMedicalRecord({
                    patient_id: medicalData.patient_id,
                    doctor_id: medicalData.doctor_id,
                    medical_notes: medicalData.medical_notes,
                    diagnoses: medicalData.diagnoses,
                    prescriptions: medicalData.prescriptions,
                    lab_results: medicalData.lab_results,

                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicalRecord(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/medical-records/${id}`, medicalRecord);
            Alert.success('Medical Record updated successfully!');
            navigate('/medical-records');
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

    return (
        <Row>
            <Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Update Medical Record
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>

                            <FormGroup>
                                <Label for="doctor_id">Select Doctor</Label>
                                <select id="doctor_id" name="doctor_id"
                                        className="form-control"
                                        value={medicalRecord.doctor_id}
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
                                        value={medicalRecord.patient_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>{patient.firstname}</option>
                                    ))}
                                </select>
                                {/*{user.errors.role_id && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.role_id}</span>}*/}

                            </FormGroup>
                            <FormGroup>
                                <Label for="medical_notes">Medical Notes</Label>
                                <Input
                                    id="medical_notes"
                                    name="medical_notes"
                                    placeholder="Medical Notes"
                                    type="text"
                                    value={medicalRecord.medical_notes}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="diagnoses">Diagnoses</Label>
                                <Input
                                    id="diagnoses"
                                    name="diagnoses"
                                    placeholder="Diagnoses"
                                    type="text"
                                    value={medicalRecord.diagnoses}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <FormGroup>
                                <Label for="prescriptions">Prescriptions</Label>
                                <Input
                                    id="prescriptions"
                                    name="prescriptions"
                                    placeholder="Prescriptions"
                                    type="text"
                                    value={medicalRecord.prescriptions}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="lab_results">Lab Results</Label>
                                <Input
                                    id="lab_results"
                                    name="lab_results"
                                    placeholder="Lab Results"
                                    type="text"
                                    value={medicalRecord.lab_results}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Medical Record&emsp;
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

export default EditMedicalRecord;
