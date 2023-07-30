import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {ToastContainer, toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

const ChangePassword = () => {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [changePassword, setChangePassword] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/change-password`, changePassword)
                .then(res => toast.success("Password changed successfully"));
            navigate('/starter');
            Alert.success('Password changed successfully!');

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
                    handleInternalServerError(responseData.message);
                } else {
                    // Handle other errors with unknown status codes
                    handleOtherError();
                }
            } else {
                // Handle errors without response data (network errors, etc.)
                handleNetworkError();
            }
        }

        setIsLoading(false)
        setDisable(false)
    };

    // Function to display validation errors as toast messages
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
        setChangePassword(prevState => ({
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
                        Change Password
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>

                            <FormGroup>
                                <Label for="old_password">Old Password</Label>
                                <Input
                                    id="old_password"
                                    name="old_password"
                                    placeholder="Billing Date"
                                    type="password"
                                    value={changePassword.old_password}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="new_password">New Password</Label>
                                <Input
                                    id="new_password"
                                    name="new_password"
                                    placeholder="New Password"
                                    type="password"
                                    value={changePassword.new_password}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="new_password_confirmation">Confirm Password</Label>
                                <Input
                                    id="new_password_confirmation"
                                    name="new_password_confirmation"
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={changePassword.new_password_confirmation}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Password&emsp;
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

export default ChangePassword;
