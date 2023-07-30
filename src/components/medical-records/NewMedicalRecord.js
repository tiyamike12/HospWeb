import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_API_URL;

function NewMedicalRecord() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [labTests, setLabTests] = useState([]);

    const [medicalRecord, setMedicalRecord] = useState({
        patient_id: '',
        user_id: '',
        medical_notes: '',
        diagnoses: '',
        prescriptions: '',
        lab_results: [], // Update to an empty array
        billing: [
            {
                billing_date: moment().format('YYYY-MM-DD'), // Set the default date to today's date
                amount: '',
                payment_status: '',
            },
        ],
    });

    useEffect(() => {
        axios.get(`${BASE_URL}/lab-tests`)
            .then(response => setLabTests(response.data))
            .catch(error => console.log(error));
    }, []);

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
        console.log(medicalRecord)
        try {
            await axios.post(`${BASE_URL}/medical-records`, medicalRecord)
                .then(res => toast.success("Medical Record created successfully"));
            navigate('/medical-records');
            Alert.success('Medical Record added successfully!');

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
        setMedicalRecord((prevState) => {
            if (name === 'lab_results') {
                return {
                    ...prevState,
                    lab_results: Array.from(e.target.selectedOptions, (option) => parseInt(option.value)),
                };
            }
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleBillingChange = (index, field) => (e) => {
        const { value } = e.target;
        setMedicalRecord((prevState) => {
            const billing = prevState.billing.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        [field]: value,
                    };
                }
                return item;
            });
            return { ...prevState, billing };
        });
    };

    const handleAddBilling = () => {
        setMedicalRecord((prevState) => ({
            ...prevState,
            billing: [
                ...prevState.billing,
                {
                    billing_date: moment().format('YYYY-MM-DD'),
                    amount: '',
                    payment_status: '',
                },
            ],
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
                        Create a Medical Record
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="user_id">Select Doctor</Label>
                                <select id="user_id" name="user_id"
                                        className="form-control"
                                        value={medicalRecord.user_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.username}</option>
                                    ))}
                                </select>

                            </FormGroup>

                            <FormGroup>
                                <Label for="patient_id">Select Patient</Label>
                                <select id="patient_id" name="patient_id"
                                        className="form-control"
                                        value={medicalRecord.patient_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>{patient.firstname} {patient.surname}</option>
                                    ))}
                                </select>

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
                                <Label for="lab_results">Lab Tests</Label>
                                <Input
                                    id="lab_results"
                                    name="lab_results"
                                    type="select"
                                    multiple
                                    value={medicalRecord.lab_results}
                                    onChange={handleChange}
                                >
                                    {labTests.map((test) => (
                                        <option key={test.id} value={test.id}>
                                            {test.test_name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>


                            {medicalRecord.billing.map((billing, index) => (
                                <div key={index}>
                                    <FormGroup>
                                        <Label for={`billing_date_${index}`}>Billing Date</Label>
                                        <Input
                                            id={`billing_date_${index}`}
                                            name={`billing_date_${index}`}
                                            type="date"
                                            value={billing.billing_date}
                                            onChange={handleBillingChange(index, 'billing_date')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for={`amount_${index}`}>Amount</Label>
                                        <Input
                                            id={`amount_${index}`}
                                            name={`amount_${index}`}
                                            type="number"
                                            value={billing.amount}
                                            onChange={handleBillingChange(index, 'amount')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for={`payment_status_${index}`}>Payment Status</Label>
                                        <Input
                                            id={`payment_status_${index}`}
                                            name={`payment_status_${index}`}
                                            type="text"
                                            value={billing.payment_status}
                                            onChange={handleBillingChange(index, 'payment_status')}
                                        />
                                    </FormGroup>
                                    <hr />
                                </div>
                            ))}
                            <Button onClick={handleAddBilling}>Add Billing</Button>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Add Medical Record&emsp;
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

export default NewMedicalRecord;
