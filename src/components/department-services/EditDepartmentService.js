import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditDepartmentService() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [departmentService, setDepartmentService] = useState({
        service_name: '',
        description: '',
        department_id:''
    });
    const { id } = useParams();

    useEffect(() => {

        axios.get(`${BASE_URL}/department-services/${id}`)
            .then(response => {
                const departmentData = response.data;
                setDepartmentService({
                    service_name: departmentData.service_name,
                    description: departmentData.description,
                    department_id: departmentData.department_id,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    useEffect(() => {
        axios.get(`${BASE_URL}/departments`)
            .then(response => setDepartments(response.data))
            .catch(error => console.log(error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartmentService(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/department-services/${id}`, departmentService);
            Alert.success('Department service updated successfully!');
            navigate('/department-services');
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
                        Edit Department Service
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="service_name">Service Name</Label>
                                <Input
                                    id="service_name"
                                    name="service_name"
                                    placeholder="Service Name"
                                    type="text"
                                    value={departmentService.service_name}
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
                                    value={departmentService.description}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="department_id">Select Department</Label>
                                <select
                                    id="department_id"
                                    name="department_id"
                                    className="form-control"
                                    value={departmentService.department_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Please select a value</option>
                                    {departments.map((record) => (
                                        <option key={record.id} value={record.id}>
                                            {record.department_name}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Department Service&emsp;
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

export default EditDepartmentService;
