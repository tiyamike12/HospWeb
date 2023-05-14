import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditInventory() {
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
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/inventories/${id}`)
            .then(response => {
                const inventoryData = response.data;
                setInventory({
                    item_name: inventoryData.item_name,
                    item_description: inventoryData.item_description,
                    quantity: inventoryData.quantity,
                    supplier: inventoryData.supplier,
                    cost: inventoryData.cost,
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    const handleInputChange = e => {
        setInventory({ ...inventory, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/inventories/${id}`, inventory);
            Alert.success('Inventory updated successfully!');
            navigate('/inventories');
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
                        Edit Inventory
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                />
                            </FormGroup>


                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update Inventory&emsp;
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

export default EditInventory;
