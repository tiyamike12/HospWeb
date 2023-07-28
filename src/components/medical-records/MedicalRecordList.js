import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const MedicalRecordList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        axios.get(  `${BASE_URL}/medical-records`)
            .then(response => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/medical-records/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('Medical Record removed successfully')
                //NotificationManager.success('User removed successfully');
                Alert.success('Medical Record removed successfully!');

            })
            .catch(error => console.log(error));
    };

    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Medical Records Listing</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-medical-record'} className="btn btn-primary">Add New Medical Record</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Medical Records
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Patient</th>
                                <th>Medical Notes</th>
                                <th>Diagnoses</th>
                                <th>Prescriptions</th>
                                <th>Lab Results</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            </thead>
                            <tbody>
                            {listData.map((tdata) => (
                                <tr key={tdata.id} className="border-top">
                                    <td>{tdata.doctor.person.firstname} {tdata.doctor.person.lastname}</td>
                                    <td>{tdata.patient.firstname} {tdata.patient.surname}</td>
                                    <td>{tdata.medical_notes}</td>
                                    <td>{tdata.diagnoses}</td>

                                    <td>{tdata.prescriptions}</td>
                                    <td>{tdata.lab_results}</td>

                                    <td><Link to={`/edit-medical-record/${tdata.id}`} className="btn btn-outline-primary">Edit</Link></td>
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
                    <Modal.Title>Remove Medical Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this record?</Modal.Body>
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

export default MedicalRecordList;