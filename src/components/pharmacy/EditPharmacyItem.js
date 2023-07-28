import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditPharmacyItem() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [pharmacyItem, setPharmacyItem] = useState({
        item_name: '',
        description: '',
        quantity_available: '',
        unit_price: ''
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/pharmacy-items/${id}`)
            .then(response => {
                const pharmacyData = response.data;
                setPharmacyItem({
                    item_name: pharmacyData.item_name,
                    description: pharmacyData.description,
                    quantity_available: pharmacyData.quantity_available,
                    unit_price: pharmacyData.unit_price,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPharmacyItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/pharmacy-items/${id}`, pharmacyItem);
            Alert.success('Pharmacy Item Record updated successfully!');
            navigate('/pharmacy-items');
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
                        Update Pharmacy Item
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


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Pharmacy Item&emsp;
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

export default EditPharmacyItem;
