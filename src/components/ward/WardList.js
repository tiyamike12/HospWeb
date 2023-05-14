import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const WardList = () => {
    const [wardsList, setWardsList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/wards`)
            .then(response => {
                setWardsList(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/wards/${selectedItemId}`)
            .then(response => {
                setWardsList(wardsList.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('User removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Ward removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(wardsList)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Wards Listing</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-ward'} className="btn btn-primary">Add New Ward</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Overview of the wards in the system
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Ward Name</th>
                                <th>Ward Type</th>

                                <th>Capacity</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {wardsList.map((ward) => (
                                <tr key={ward.id} className="border-top">
                                    <td>
                                        {ward.ward_name}
                                    </td>
                                    <td>{ward.ward_type}</td>

                                    <td>{ward.capacity}</td>
                                    <td><Link to={`/edit-ward/${ward.id}`} className="btn btn-outline-primary">Edit</Link></td>
                                    <td><button className="btn btn-danger" onClick={() => {
                                        setSelectedItemId(ward.id);
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
                    <Modal.Title>Remove Ward</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this ward?</Modal.Body>
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

export default WardList;