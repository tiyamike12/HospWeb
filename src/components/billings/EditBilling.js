import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import Alert from 'react-s-alert';
import Select from 'react-select';

const BASE_URL = process.env.REACT_APP_API_URL;

const EditBilling = () => {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [insuranceProviders, setInsuranceProviders] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedInsuranceProvider, setSelectedInsuranceProvider] = useState(null);
    const [currentPageMedicalRecords, setCurrentPageMedicalRecords] = useState(1);
    const [currentPagePatients, setCurrentPagePatients] = useState(1);
    const [totalPagesPatients, setTotalPagesPatients] = useState(1);
    const [totalPagesMedicalRecords, setTotalPagesMedicalRecords] = useState(1);

    const { id } = useParams();

    const [billing, setBilling] = useState({
        patient_id: '',
        billing_date: '',
        amount: '',
        payment_status: '',
        insurance_provider_id: '',
        medical_record_id: '',
    });

    useEffect(() => {
        fetchPatientsByPage(currentPagePatients);
        fetchMedicalRecordsByPage(currentPageMedicalRecords);
    }, [currentPagePatients, currentPageMedicalRecords]);

    const fetchPatientsByPage = (page) => {
        axios.get(`${BASE_URL}/patients?page=${page}`)
            .then((response) => {
                const formattedPatients = response.data.data.map((patient) => ({
                    value: patient.id,
                    label: `${patient.firstname} ${patient.surname}`,
                    provider_id: patient.provider_id,
                }));
                setPatients((prevPatients) => [...prevPatients, ...formattedPatients]);
                setTotalPagesPatients(response.data.meta.last_page);
            })
            .catch((error) => console.log(error));
    };

    const fetchMedicalRecordsByPage = (page) => {
        axios.get(`${BASE_URL}/medical-records?page=${page}`)
            .then((response) => {
                setMedicalRecords(response.data.data);
            })
            .catch((error) => console.error('Error fetching medical records:', error));
    };

    useEffect(() => {
        // axios.get(`${BASE_URL}/patients`)
        //     .then((response) => {
        //         const formattedPatients = response.data.map((patient) => ({
        //             value: patient.id,
        //             label: `${patient.firstname} ${patient.surname}`,
        //             provider_id: patient.provider_id, // Add the provider_id to the patient option
        //         }));
        //         setPatients(formattedPatients);
        //     })
        //     .catch((error) => console.log(error));
        axios.get(`${BASE_URL}/insurance-providers`)
            .then((response) => {
                // Add the "Cash (No Insurance)" option to the insurance providers list
                const formattedProviders = response.data.map((provider) => ({
                    value: provider.id,
                    label: provider.provider_name,
                }));
                formattedProviders.unshift({ value: '', label: 'Cash (No Insurance)' });
                setInsuranceProviders(formattedProviders);
            });
        // axios.get(`${BASE_URL}/medical-records`)
        //     .then((response) => setMedicalRecords(response.data))
        //     .catch((error) => console.error('Error fetching medical records:', error));

        // Fetch billing details using the billingId
        axios.get(`${BASE_URL}/billings/${id}`)
            .then((response) => {
                const billingData = response.data;
                setBilling({
                    patient_id: billingData.patient_id,
                    billing_date: billingData.billing_date,
                    amount: billingData.amount,
                    payment_status: billingData.payment_status,
                    insurance_provider_id: billingData.insurance_provider_id,
                    medical_record_id: billingData.medical_record_id,
                });
                // Fetch patient details using the billing's patient_id
                axios.get(`${BASE_URL}/patients/${billingData.patient_id}`)
                    .then((patientResponse) => {
                        const patientData = patientResponse.data;
                        const providerId = patientData.provider_id;
                        // Find the associated insurance provider and set it in the state
                        const associatedInsuranceProvider = insuranceProviders.find((provider) => provider.value === providerId);
                        setSelectedInsuranceProvider(associatedInsuranceProvider);
                        setSelectedPatient({
                            value: patientData.id,
                            label: `${patientData.firstname} ${patientData.surname}`,
                            provider_id: patientData.provider_id,
                        });
                    })
                    .catch((error) => console.error('Error fetching patient details:', error));
            })
            .catch((error) => console.error('Error fetching billing details:', error));
    }, []);

    const handleSubmit = async (e) => {
        setIsLoading(true);
        setDisable(true);
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/billings/${id}`, billing)
                .then((res) => toast.success('Bill Record updated successfully'));
            navigate('/billings');
            Alert.success('Bill Record updated successfully!');
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

        setIsLoading(false);
        setDisable(false);
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
        setBilling((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePatientChange = (selectedOption) => {
        setSelectedPatient(selectedOption);
        setBilling((prevState) => ({
            ...prevState,
            patient_id: selectedOption ? selectedOption.value : '',
            insurance_provider_id: selectedOption ? selectedOption.provider_id : '', // Set the insurance_provider_id when a patient is selected
        }));

        if (selectedOption) {
            // Fetch patient details using the selected patient's ID
            axios
                .get(`${BASE_URL}/patients/${selectedOption.value}`)
                .then((response) => {
                    const patientData = response.data;
                    const providerId = patientData.provider_id;

                    // Find the associated insurance provider and set it in the state
                    const associatedInsuranceProvider = insuranceProviders.find((provider) => provider.value === providerId);
                    setSelectedInsuranceProvider(associatedInsuranceProvider);
                })
                .catch((error) => console.error('Error fetching patient details:', error));
        } else {
            setSelectedInsuranceProvider(null); // Reset the insurance provider when no patient is selected
        }
    };

    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Edit Bill
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="patient_id">Select Patient</Label>
                                <Select
                                    id="patient_id"
                                    name="patient_id"
                                    options={patients}
                                    value={selectedPatient}
                                    onChange={handlePatientChange}
                                    placeholder="Please select a value"
                                    isSearchable
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="billing_date">Billing Date</Label>
                                <Input
                                    id="billing_date"
                                    name="billing_date"
                                    placeholder="Billing Date"
                                    type="date"
                                    value={billing.billing_date}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">Amount (MK)</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    placeholder="Amount(MK)"
                                    type="text"
                                    value={billing.amount}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="medical_record_id">Select Medical Record</Label>
                                <select
                                    id="medical_record_id"
                                    name="medical_record_id"
                                    className="form-control"
                                    value={billing.medical_record_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Please select a value</option>
                                    {medicalRecords.map((record) => (
                                        <option key={record.id} value={record.id}>
                                            {record.id} - {record.patient.firstname} {record.patient.surname} - {record.medical_notes}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="payment_status">Select Payment Status</Label>
                                <select
                                    id="payment_status"
                                    name="payment_status"
                                    className="form-select"
                                    value={billing.payment_status}
                                    required
                                    onChange={handleChange}
                                >
                                    <option value="">Please select a value</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="insurance_provider_id">Select Insurance Provider</Label>
                                <Select
                                    id="insurance_provider_id"
                                    name="insurance_provider_id"
                                    options={insuranceProviders}
                                    value={selectedInsuranceProvider ? { value: selectedInsuranceProvider.value, label: selectedInsuranceProvider.label } : ''}
                                    onChange={(selectedOption) => {
                                        // When the "Cash (No Insurance)" option is selected, set insurance_provider_id to null
                                        const insuranceProviderId = selectedOption.value === '' ? null : selectedOption.value;
                                        setBilling((prevState) => ({
                                            ...prevState,
                                            insurance_provider_id: insuranceProviderId,
                                        }));
                                        setSelectedInsuranceProvider(selectedOption);
                                    }}
                                    placeholder="Please select a value"
                                    isSearchable
                                    isDisabled={!selectedPatient} // Disable the field if no patient is selected
                                />
                            </FormGroup>
                            <Button type="submit" className="btn btn-success" disabled={disable}>
                                Update Bill Record&emsp;
                                {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Alert stack={{ limit: 5 }} />
        </Row>
    );
};

export default EditBilling;
