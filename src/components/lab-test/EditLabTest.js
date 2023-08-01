import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditLabTest() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [labTest, setLabTest] = useState({
        test_name: '',
        description: '',
        lab_charges: '',
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/lab-tests/${id}`)
            .then(response => {
                const labTestData = response.data;
                setLabTest({
                    test_name: labTestData.test_name,
                    description: labTestData.description,
                    lab_charges: labTestData.lab_charges,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLabTest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/lab-tests/${id}`, labTest);
            Alert.success('Lab Test updated successfully!');
            navigate('/lab-tests');
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
    };

    // Function to handle other errors with unknown status codes
    const handleOtherError = () => {
        toast.error('An unexpected error occurred. Please try again later.');
    };

    const handleNetworkError = () => {
        toast.error('Network Error: Please check your internet connection and try again.');
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
                        Edit Lab Test
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="test_name">Test Name</Label>
                                <Input
                                    id="test_name"
                                    name="test_name"
                                    placeholder="Test Name"
                                    type="text"
                                    value={labTest.test_name}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description"> Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    placeholder=" Description"
                                    type="text"
                                    value={labTest.description}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="lab_charges">Lab Charges</Label>
                                <Input
                                    id="lab_charges"
                                    name="lab_charges"
                                    placeholder="Lab Charges"
                                    type="number"
                                    value={labTest.lab_charges}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Lab Test&emsp;
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

export default EditLabTest;
