import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {ToastContainer, toast} from "react-toastify";
import Alert from "react-s-alert";
import validator from 'validator';

const BASE_URL = process.env.REACT_APP_API_URL;

function CreateUser() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState([]);
   const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        // password: '',
        phone: '',
        role_id: '',
        firstname: '',
        lastname: '',
        date_of_birth: '',
        gender: '',
        physical_address:'',
        job_title:''
    });
    //const [errors, setErrors] = useState({});
    useEffect(() => {
        axios.get(`${BASE_URL}/roles`)
            .then(response => setRoles(response.data))
            .catch(error => console.log(error));
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setIsLoading(true)
        setDisable(true)

        try {
            console.log(user)
            await axios.post(`${BASE_URL}/users`, user)
                .then(res => toast.success("User created successfully"));
            navigate('/users');
            Alert.success('User added successfully!');

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
        setUser(prevState => ({
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
                        Create a User
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit} autoComplete="off">
                            <FormGroup>
                                <Label for="firstname">Firstname</Label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Firstname"
                                    type="text"
                                    autoComplete="off"
                                    value={user.firstname}
                                    onChange={handleChange}
                                />

                            </FormGroup>

                            <FormGroup>
                                <Label for="lastname">Lastname</Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Lastname"
                                    type="text"
                                    autoComplete="off"
                                    value={user.lastname}
                                    onChange={handleChange}
                                />

                            </FormGroup>

                            <FormGroup>
                                <Label for="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone"
                                    type="text"
                                    autoComplete="off"
                                    value={user.phone}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    autoComplete="off"
                                    value={user.email}
                                    onChange={handleChange}
                                />

                            </FormGroup>

                            <FormGroup>
                                <Label for="role_id">Select Role</Label>
                                <select id="role_id" name="role_id"
                                        className="form-control"
                                        value={user.role_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>

                            </FormGroup>

                            <FormGroup>
                                <Label for="gender">Select Gender</Label>
                                <select id="gender" name="gender" className="form-select" value={user.gender} required
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </FormGroup>

                            <FormGroup>
                                <Label for="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    type="date"
                                    value={user.date_of_birth}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="physical_address">Physical Address</Label>
                                <Input
                                    id="physical_address"
                                    name="physical_address"
                                    placeholder="Address"
                                    type="text"
                                    value={user.physical_address}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="job_title">Title/Specialization</Label>
                                <Input
                                    id="job_title"
                                    name="job_title"
                                    placeholder="Title/Specialization"
                                    type="text"
                                    value={user.job_title}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Add User&emsp;
                                {isLoading && <span className="spinner-border spinner-border-sm me-1"></span> }
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Alert stack={{ limit: 5 }} />
            <ToastContainer />

        </Row>

    );
}

export default CreateUser;
