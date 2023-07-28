import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditBilling() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [billing, setBilling] = useState({
        patient_id: '',
        billing_date: '',
        amount: '',
        payment_status: '',
    });
    const { id } = useParams();


    useEffect(() => {
        axios.get(`${BASE_URL}/patients`)
            .then(response => setPatients(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/billings/${id}`)
            .then(response => {
                const billingData = response.data;
                setBilling({
                    patient_id: billingData.patient_id,
                    billing_date: billingData.billing_date,
                    amount: billingData.amount,
                    payment_status: billingData.payment_status,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBilling(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/billings/${id}`, billing);
            Alert.success('Billing updated successfully!');
            navigate('/billings');
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
                        Update Bill
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>

                            <FormGroup>
                                <Label for="patient_id">Select Patient</Label>
                                <select id="patient_id" name="patient_id"
                                        className="form-control"
                                        value={billing.patient_id}
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>{patient.firstname}</option>
                                    ))}
                                </select>
                                {/*{user.errors.role_id && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.role_id}</span>}*/}

                            </FormGroup>
                            <FormGroup>
                                <Label for="billing_date">Billing Date</Label>
                                <Input
                                    id="billing_date"
                                    name="billing_date"
                                    placeholder="Billing Date"
                                    type="date"
                                    value={billing.billing_date}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">Amount (MK)</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    placeholder="Amount(MK)"
                                    type="text"
                                    value={billing.amount}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <FormGroup>
                                <Label for="payment_status">Select Payment Status</Label>
                                <select id="payment_status" name="payment_status" className="form-select" value={billing.payment_status} required
                                        onChange={handleChange}>
                                    <option value="">Please select a value</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Bill&emsp;
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

export default EditBilling;
