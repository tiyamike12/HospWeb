import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';
const BASE_URL = process.env.REACT_APP_API_URL;

const UsersList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/users`)
            .then(response => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/users/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('User removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('User removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(listData)

    return (
        <div>
            {isLoaded ? (
            <Card>


                <CardBody>
                    <CardTitle tag="h5">Users Listing</CardTitle>
                    <div className="d-flex justify-content-end">
                        <Link to={'/new-user'} className="btn btn-primary">Add New User</Link>
                    </div>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        Overview of the users in the system
                    </CardSubtitle>

                    <Table className="no-wrap mt-3 align-middle" responsive borderless>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>

                            <th>Role</th>
                            <th>Edit</th>
                            <th>Delete</th>

                        </tr>
                        </thead>
                        <tbody>
                        {listData.map((tdata) => (
                            <tr key={tdata.id} className="border-top">
                                <td>
                                    <div className="d-flex align-items-center p-2">
                                        <div className="ms-3">
                                            <h6 className="mb-0">{tdata.person.firstname} {tdata.person.lastname}</h6>
                                            <span className="text-muted">{tdata.person.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{tdata.person.email}</td>

                                <td>{tdata.role.name}</td>
                                <td><Link to={`/edit-user/${tdata.id}`} className="btn btn-outline-primary">Edit</Link></td>
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
                    <Modal.Title>Remove User Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this account?</Modal.Body>
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

export default UsersList;