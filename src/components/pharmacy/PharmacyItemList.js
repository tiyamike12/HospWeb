import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const PharmacyItemList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/pharmacy-items`)
            .then(response => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/pharmacy-items/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('Pharmacy item removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Pharmacy Item removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>
                    <CardBody>
                        <CardTitle tag="h5">Pharmacy Item Listing</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-pharmacy-item'} className="btn btn-primary">Add New Pharmacy Item Record</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Pharmacy Items
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Description</th>

                                <th>Quantity Available</th>
                                <th>Unit Price</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {listData.map((tdata) => (
                                <tr key={tdata.id} className="border-top">
                                    <td>{tdata.item_name}</td>
                                    <td>{tdata.description}</td>
                                    <td>{tdata.quantity_available}</td>
                                    <td>{tdata.unit_price}</td>

                                    <td><Link to={`/edit-pharmacy-item/${tdata.id}`} className="btn btn-outline-primary">Edit</Link></td>
                                    <td><button className="btn btn-danger" onClick={() => {
                                        setSelectedItemId(tdata.id);
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
                    <Modal.Title>Remove Pharmacy Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this item?</Modal.Body>
                <Modal.Footer>
                    <Button  className="btn btn-outline-light" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn btn-danger" role="button" onClick={handleDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Alert stack={{ limit: 5 }} />

        </div>
    )
}

export default PharmacyItemList;