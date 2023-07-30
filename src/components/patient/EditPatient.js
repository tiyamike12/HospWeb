import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditPatient() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        firstname: '',
        surname: '',
        gender: '',
        date_of_birth: '',
        phone: '',
        email: '',
        physical_address: '',
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/patients/${id}`)
            .then(response => {
                const userData = response.data;
                setPatient({
                    firstname: userData.firstname,
                    surname: userData.surname,
                    gender: userData.gender,
                    date_of_birth: userData.date_of_birth,
                    phone: userData.phone,
                    email: userData.email,
                    physical_address: userData.physical_address,

                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleInputChange = e => {
        setPatient({ ...patient, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/patients/${id}`, patient);
            Alert.success('Patient updated successfully!');
            navigate('/patients');
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

    return (
        <Row>
            <Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Update a Patient Record
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="firstname">First Name</Label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    placeholder="First Name"
                                    type="text"
                                    value={patient.firstname}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="surname">Last Name</Label>
                                <Input
                                    id="surname"
                                    name="surname"
                                    placeholder="Last Name"
                                    type="text"
                                    value={patient.surname}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="gender">Select Gender</Label>
                                <select id="gender" name="gender" className="form-select" value={patient.gender} required
                                        onChange={handleInputChange}>
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
                                    value={patient.date_of_birth}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone"
                                    type="number"
                                    value={patient.phone}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    value={patient.email}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="physical_address">Physical Address</Label>
                                <Input
                                    id="physical_address"
                                    name="physical_address"
                                    placeholder="Address"
                                    type="text"
                                    value={patient.physical_address}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Patient&emsp;
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

export default EditPatient;
