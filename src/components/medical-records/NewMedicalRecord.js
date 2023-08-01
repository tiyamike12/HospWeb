import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
import moment from 'moment';
import Select from 'react-select';

const BASE_URL = process.env.REACT_APP_API_URL;

function NewMedicalRecord() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [medicalRecord, setMedicalRecord] = useState({
        patient_id: '',
        user_id: '',
        medical_notes: '',
        diagnoses: '',
        prescriptions: '',
        lab_results: [], // Update to an empty array
    });

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
        setMedicalRecord(prevState => ({
            ...prevState,
            patient_id: selectedOption ? selectedOption.value : '', // Set the selected patient's ID
        }));
    };

    useEffect(() => {
        // axios.get(`${BASE_URL}/patients`)
        //     .then(response => {
        //         const formattedPatients = response.data.map(patient => ({
        //             value: patient.id,
        //             label: `${patient.firstname} ${patient.surname}`,
        //         }));
        //         setPatients(formattedPatients);
        //     })
        //     .catch(error => console.log(error));
        axios.get(`${BASE_URL}/doctors`)
            .then(response => setDoctors(response.data))
            .catch(error => console.log(error));
        axios.get(`${BASE_URL}/lab-tests`)
            .then(response => setLabTests(response.data))
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

    // const handlePatientChange = (selectedOption) => {
    //     setSelectedPatient(selectedOption);
    //     setMedicalRecord(prevState => ({
    //         ...prevState,
    //         patient_id: selectedOption ? selectedOption.value : '',
    //     }));
    // };

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
                                        <option key={doctor.id} value={doctor.id}>{doctor.person.firstname} {doctor.person.lastname}</option>
                                    ))}
                                </select>

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
                            {/*    <Select*/}
                            {/*        id="patient_id"*/}
                            {/*        name="patient_id"*/}
                            {/*        options={patients}*/}
                            {/*        value={selectedPatient}*/}
                            {/*        onChange={handlePatientChange}*/}
                            {/*        placeholder="Please select a value"*/}
                            {/*        isSearchable*/}
                            {/*    />*/}
                            {/*</FormGroup>*/}
                            {/*<FormGroup>*/}
                            {/*    <Label for="patient_id">Select Patient</Label>*/}
                            {/*    <select id="patient_id" name="patient_id"*/}
                            {/*            className="form-control"*/}
                            {/*            value={medicalRecord.patient_id}*/}
                            {/*            onChange={handleChange}>*/}
                            {/*        <option value="">Please select a value</option>*/}
                            {/*        {patients.map(patient => (*/}
                            {/*            <option key={patient.id} value={patient.id}>{patient.firstname} {patient.surname}</option>*/}
                            {/*        ))}*/}
                            {/*    </select>*/}

                            {/*</FormGroup>*/}

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
