import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const DepartmentServiceList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/department-services`)
            .then(response => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/department-services/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('Department service removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Department service removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Department Services</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-department-service'} className="btn btn-primary">Add New Department Service</Link>
                        </div>

                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Departments Service
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Description</th>
                                <th>Department</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {listData.map((data) => (
                                <tr key={data.id} className="border-top">

                                    <td>{data.service_name}</td>
                                    <td>{data.description}</td>
                                    <td>{data.department.department_name}</td>

                                    <td><Link to={`/edit-department-service/${data.id}`} className="btn btn-outline-primary">Edit</Link></td>
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
                    <Modal.Title>Remove service</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this service?</Modal.Body>
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

export default DepartmentServiceList;