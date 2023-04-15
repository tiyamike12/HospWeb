import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
import validator from 'validator';
const BASE_URL = process.env.REACT_APP_API_URL;

function EditWard() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [ward, setWard] = useState({
        ward_name: '',
        ward_type: '',
        capacity: '',
        //errors: {}
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/wards/${id}`)
            .then(response => {
                const wardData = response.data;
                setWard({
                    ward_name: wardData.ward_name,
                    ward_type: wardData.ward_type,
                    capacity: wardData.capacity,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleInputChange = e => {
        setWard({ ...ward, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const errors = {};
        //
        // if (validator.isEmpty(ward.ward_name)) {
        //     errors.ward_name = 'Ward Name is required';
        // }
        //
        // if (validator.isNumeric(ward.ward_name)) {
        //     errors.ward_name = 'Ward Name must be text';
        // }
        //
        // if (validator.isEmpty(ward.ward_type)) {
        //     errors.ward_type = 'Ward Type is required';
        // }
        //
        // if (validator.isEmpty(ward.capacity)) {
        //     errors.capacity = 'Capacity is required';
        // }
        //
        // if (Object.keys(errors).length) {
        //     setWard({ ...ward, errors });
        //     return;
        // }

        setIsLoading(true)
        setDisable(true)

        try {
            await axios.patch(`${BASE_URL}/wards/${id}`, ward);
            Alert.success('Ward updated successfully!');
            navigate('/wards');
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

    const getSelectClassName = name => {
        if (ward.errors[name]) {
            return 'form-select is-invalid';
        } else if (ward[name]) {
            return 'form-select is-valid';
        } else {
            return 'form-select';
        }
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
                        Edit Ward
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="ward_name">Ward Name</Label>
                                <Input
                                    id="ward_name"
                                    name="ward_name"
                                    placeholder="Ward Name"
                                    type="text"
                                    value={ward.ward_name}
                                    // valid={!!ward.ward_name && !ward.errors.ward_name}
                                    // invalid={!!ward.errors.ward_name}
                                    onChange={handleInputChange}
                                />
                                {/*{ward.errors.ward_name && <span className="text-danger" style={{ marginTop: 10}}>{ward.errors.ward_name}</span>}*/}
                            </FormGroup>
                            <FormGroup>
                                <Label for="ward_type">Select Ward Type</Label>
                                <select id="ward_type" name="ward_type"
                                        // className={getSelectClassName('ward_type')}
                                        className="form-control"
                                        value={ward.ward_type}
                                        onChange={handleInputChange}>
                                    <option value="">Please select a value</option>
                                    <option value="General Ward">General Ward</option>
                                    <option value="Private Ward">Private Ward</option>
                                    <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                                    <option value="Pediatric Ward">Pediatric Ward</option>
                                    <option value="Maternity Ward">Maternity Ward</option>
                                </select>
                                {/*{ward.errors.ward_type && <span className="text-danger" style={{ marginTop: 10}}>{ward.errors.ward_type}</span>}*/}

                            </FormGroup>
                            <FormGroup>
                                <Label for="capacity">Ward Capacity</Label>
                                <Input
                                    id="capacity"
                                    name="capacity"
                                    placeholder="Ward Capacity"
                                    type="number"
                                    value={ward.capacity}
                                    // valid={!!ward.capacity && !ward.errors.capacity}
                                    // invalid={!!ward.errors.capacity}
                                    onChange={handleInputChange}
                                />
                                {/*{ward.errors.capacity && <span className="text-danger" style={{ marginTop: 10}}>{ward.errors.capacity}</span>}*/}
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Ward&emsp;
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

export default EditWard;
