import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function CreateInventory() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [inventory, setInventory] = useState({
        item_name: '',
        item_description: '',
        quantity: '',
        supplier: '',
        cost: '',
    });
    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/inventories`, inventory)
                .then(res => toast.success("Inventory Record created successfully"));
            navigate('/inventories');
            Alert.success('Inventory Record added successfully!');

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
        setInventory({ ...inventory, [e.target.name]: e.target.value });
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
                        Create an Inventory Record
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
                                    value={inventory.item_name}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="item_description">Item Description</Label>
                                <Input
                                    id="item_description"
                                    name="item_description"
                                    placeholder="Item Description"
                                    type="text"
                                    value={inventory.item_description}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    placeholder="Quantity"
                                    type="number"
                                    value={inventory.quantity}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="supplier">Supplier</Label>
                                <Input
                                    id="supplier"
                                    name="supplier"
                                    placeholder="Supplier"
                                    type="text"
                                    value={inventory.supplier}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="cost">Cost</Label>
                                <Input
                                    id="cost"
                                    name="cost"
                                    placeholder="Cost"
                                    type="number"
                                    value={inventory.cost}
                                    onChange={handleChange}
                                />
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Add Inventory&emsp;
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

export default CreateInventory;
