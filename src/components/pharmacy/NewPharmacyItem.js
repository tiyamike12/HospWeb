import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function NewPharmacyItem() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const navigate = useNavigate();
    const [pharmacyItem, setPharmacyItem] = useState({
        item_name: '',
        description: '',
        quantity_available: '',
        unit_price: '',
        initial_quantity:'',
        threshold_quantity:''
    });
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/pharmacy-items`, pharmacyItem)
                .then(res => toast.success("Pharmacy Item Record created successfully"));
            navigate('/pharmacy-items');
            Alert.success('Patient Record added successfully!');

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
        setPharmacyItem(prevState => ({
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
                        Create a Pharmacy Item Record
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="item_name">Item Name</Label>
                                <Input
                                    id="item_name"
                                    name="item_name"
                                    placeholder="Item Name"
                                    type="text"
                                    value={pharmacyItem.item_name}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    placeholder="Description"
                                    type="text"
                                    value={pharmacyItem.description}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="quantity_available">Quantity Available</Label>
                                <Input
                                    id="quantity_available"
                                    name="quantity_available"
                                    type="text"
                                    value={pharmacyItem.quantity_available}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="unit_price">Unit Price</Label>
                                <Input
                                    id="unit_price"
                                    name="unit_price"
                                    placeholder="Unit Price"
                                    type="number"
                                    value={pharmacyItem.unit_price}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="initial_quantity">Initial Quantity</Label>
                                <Input
                                    id="initial_quantity"
                                    name="initial_quantity"
                                    type="number"
                                    value={pharmacyItem.initial_quantity}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="threshold_quantity">Threshold Quantity</Label>
                                <Input
                                    id="threshold_quantity"
                                    name="threshold_quantity"
                                    type="number"
                                    value={pharmacyItem.threshold_quantity}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Add Pharmacy Item&emsp;
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

export default NewPharmacyItem;
