import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const LabTestsList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/lab-tests`)
            .then(response => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/lab-tests/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('Lab Test removed successfully')

            })
            .catch(error => console.log(error));
    };

    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Lab Tests</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-lab-test'} className="btn btn-primary">Add New Lab Test</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Lab Test
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Description</th>
                                <th>Lab Charges</th>

                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {listData.map((data) => (
                                <tr key={data.id} className="border-top">

                                    <td>{data.test_name}</td>
                                    <td>{data.description}</td>
                                    <td>{data.lab_charges}</td>
                                    <td><Link to={`/edit-lab-test/${data.id}`} className="btn btn-outline-primary">Edit</Link></td>
                                    <td><button className="btn btn-danger" onClick={() => {
                                        setSelectedItemId(data.id);
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
                    <Modal.Title>Remove Lab Test</Modal.Title>
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

export default LabTestsList;