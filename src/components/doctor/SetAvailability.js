import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function SetAvailability() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [availability, SetAvailability] = useState({
        doctor_id: '',
        start_time: '',
        end_time: '',
    });

    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/doctor/availability/${id}`)
            .then(response => {
                const availabilityData = response.data;
                SetAvailability({
                    doctor_id: availabilityData.doctor_id,
                    start_time: availabilityData.start_time,
                    end_time: availabilityData.end_time,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/doctor/availability/${id}`, availability)
                .then(res => toast.success("Available Time updated successfully"));
            navigate('/starter');
            Alert.success('Available Record updated successfully!');

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
        SetAvailability(prevState => ({
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
                        Update Availability
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="start_time">Start Time</Label>
                                <Input
                                    id="start_time"
                                    name="start_time"
                                    placeholder="Start Time"
                                    type="time"
                                    value={availability.start_time}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="end_time"> Time</Label>
                                <Input
                                    id="end_time"
                                    name="end_time"
                                    placeholder="End Time"
                                    type="time"
                                    value={availability.end_time}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update&emsp;
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

export default SetAvailability;
