import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function NewInsuranceProvider() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [insuranceProvider, setInsuranceProvider] = useState({
        provider_name: '',
        contact_information: '',
    });
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/insurance-providers`, insuranceProvider)
                .then(res => toast.success("Insurance Provider Record created successfully"));
            navigate('/insurance-providers');
            Alert.success('Insurance Provider Record added successfully!');

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
        setInsuranceProvider(prevState => ({
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
                        Create Insurance Provider
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="provider_name">Provider Name</Label>
                                <Input
                                    id="provider_name"
                                    name="provider_name"
                                    placeholder="Provider Name"
                                    type="text"
                                    value={insuranceProvider.provider_name}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="contact_information"> Contact Information</Label>
                                <Input
                                    id="contact_information"
                                    name="contact_information"
                                    placeholder=" Description"
                                    type="text"
                                    value={insuranceProvider.contact_information}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Add Insurance Provider&emsp;
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

export default NewInsuranceProvider;
