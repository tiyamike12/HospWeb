import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications-component/dist/theme.css';
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const InventoryList = () => {
    const [inventoryList, setInventoryList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/inventories`)
            .then(response => {
                setInventoryList(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/inventories/${selectedItemId}`)
            .then(response => {
                setInventoryList(inventoryList.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('User removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Inventory removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(inventoryList)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Inventory Listing</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-inventory'} className="btn btn-primary">Add New Inventory</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Overview of the inventories in the system
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Item Description</th>
                                <th>Quantity</th>
                                <th>Supplier</th>

                                <th>Cost</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {inventoryList.map((inventory) => (
                                <tr key={inventory.id} className="border-top">
                                    <td>
                                        {inventory.item_name}
                                    </td>
                                    <td>{inventory.item_description}</td>
                                    <td>{inventory.quantity}</td>
                                    <td>{inventory.supplier}</td>
                                    <td>{inventory.cost}</td>
                                    <td><Link to={`/edit-inventory/${inventory.id}`} className="btn btn-outline-primary">Edit</Link></td>
                                    <td><button className="btn btn-danger" onClick={() => {
                                        setSelectedItemId(inventory.id);
                                        setShowModal(true);}}>
                                        Delete
                                    </button></td>

                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card> ) : (<p>Loading...</p>)}

            <Modal show={showModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Inventory</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this inventory?</Modal.Body>
                <Modal.Footer>
                    <Button  className="btn btn-outline-light" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn btn-danger" role="button" onClick={handleDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <NotificationContainer />
            <Alert stack={{ limit: 5 }} />

        </div>
    )
}

export default InventoryList;