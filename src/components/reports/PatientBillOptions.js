import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
import Select from "react-select";
import PatientOutstandingBills from "./PatientOutstandingBills";
import ProviderOutstandingBills from "./ProviderOutstandingBills";

const BASE_URL = process.env.REACT_APP_API_URL;

function PatientBillOptions() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingProviders, setIsLoadingProviders] = useState(false);
    const [insuranceProviders, setInsuranceProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const handleClearSelection = () => {
        setSelectedPatient(null);
        setSelectedProvider(null);
    };

    useEffect(() => {
        fetchPatientsByPage(currentPage);
    }, [currentPage]);

    useEffect(() => {
        fetchInsuranceProviders();
    }, []);
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
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    };

    const fetchInsuranceProviders = () => {
        setIsLoadingProviders(true);
        axios.get(`${BASE_URL}/insurance-providers`)
            .then(response => {
                const formattedProviders = response.data.map(provider => ({
                    value: provider.id,
                    label: provider.provider_name,
                }));
                setInsuranceProviders(formattedProviders);
                setIsLoadingProviders(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoadingProviders(false);
            });
    };
    const handlePatientChange = (selectedOption) => {
        setSelectedPatient(selectedOption);
    };

    const handleProviderChange = (selectedOption) => {
        setSelectedProvider(selectedOption);
    };
    const handleFetchPatientBills = () => {
        if (selectedPatient) {
            setSelectedPatient(selectedPatient.value);

            console.log("Fetch bills for patient with ID:", selectedPatient.value);
            // Make an API call to fetch outstanding bills for the selected patient

        } else {
            console.log('Please select a patient.');
        }
    };

    const handleFetchProviderBills = () => {
        console.log("Fetch bills for provider with ID:", selectedProvider.value);

        if (selectedProvider) {

            selectedProvider(selectedProvider.value);


        } else {
            // Handle the case when no patient is selected
            // For example, show an error message or notification
            console.log('Please select a patient.');
        }
    };

    return (
        <>
            <Card>
                <CardBody>
                    <Row>
                        <Col sm="6">
                    <Select
                        options={patients}
                        value={selectedPatient}
                        onChange={handlePatientChange}
                        placeholder="Select a patient..."
                        isSearchable
                        isLoading={isLoading}
                        onMenuScrollToBottom={() => {
                            if (!isLoading && currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                            }
                        }}
                    />
                        </Col>
                        <Col sm="4">
                    <Select
                        options={insuranceProviders}
                        value={selectedProvider}
                        onChange={handleProviderChange}
                        placeholder="Select an insurance provider..."
                        isSearchable
                    />
                        </Col>
                        <Col sm="2">
                            <Button color="primary" onClick={handleClearSelection}>Clear</Button>
                        </Col>
                    </Row>
                    {selectedPatient && (
                        <PatientOutstandingBills patientId={selectedPatient.value}/>
                    )}

                    {selectedProvider && (
                        <ProviderOutstandingBills providerId={selectedProvider.value}/>
                    )}

                </CardBody>
            </Card>
        </>

    );
}

export default PatientBillOptions;