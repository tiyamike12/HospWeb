import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditOperationTheatre() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [operationTheatre, setOperationTheatre] = useState({
        theatre_name: '',
        description: '',
        availability: '',
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/operation-theatres/${id}`)
            .then(response => {
                const operationData = response.data;
                setOperationTheatre({
                    theatre_name: operationData.theatre_name,
                    description: operationData.description,
                    availability: operationData.availability,

                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOperationTheatre(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/operation-theatres/${id}`, operationTheatre);
            Alert.success('Operation Theatre updated successfully!');
            navigate('/operation-theatres');
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
                        Update Operation Theatre
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>


                            <FormGroup>
                                <Label for="theatre_name">Theatre Name</Label>
                                <Input
                                    id="theatre_name"
                                    name="theatre_name"
                                    placeholder="Theatre Name"
                                    type="text"
                                    value={operationTheatre.theatre_name}
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
                                    value={operationTheatre.description}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="availability">Select Availability</Label>
                                <select id="availability" name="availability" className="form-select" value={operationTheatre.availability} required
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Operation Theatre&emsp;
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

export default EditOperationTheatre;
