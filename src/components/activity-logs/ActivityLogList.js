import {Button, Card, CardBody, CardSubtitle, CardTitle, Form, FormGroup, Input, Table} from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Alert from 'react-s-alert';
const BASE_URL = process.env.REACT_APP_API_URL;

const ActivityLogList = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsersByPage(currentPage);
    }, [currentPage]);

    const fetchUsersByPage = (page) => {
        axios
            .get(`${BASE_URL}/activity-logs?page=${page}`)
            .then((response) => {
                setListData(response.data.data);
                setTotalPages(response.data.last_page);
                setIsLoaded(true);
            })
            .catch((error) => console.log(error));
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZone: "UTC",
        };

        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const handlePaginationPrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePaginationNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handleDelete = () => {
        axios.delete(`${BASE_URL}/activity-logs/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('Log removed successfully');
                //NotificationManager.success('User removed successfully');
                Alert.success('Log removed successfully!');
            })
            .catch(error => console.log(error));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    const filteredList = listData.filter((tdata) => {
        const searchTermLower = searchTerm.toLowerCase();
        const subjectType = tdata.subject_type; // Store tdata.subject_type in a variable
        const causerId = tdata.causer_id; // Store tdata.causer_id in a variable

        // Check if searchTermLower is included in the subjectType or causerId
        return (
            subjectType.toLowerCase().includes(searchTermLower) ||
            causerId.toString().includes(searchTermLower)
        );
    });

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>
                    <CardBody>
                        <CardTitle tag="h5">Activities Listing</CardTitle>

                        <Form>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="searchTerm"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search"
                                />
                                {searchTerm && (
                                    <Button
                                        className="btn btn-link"
                                        onClick={handleClearSearch}
                                        style={{ textDecoration: "none" }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </FormGroup>
                        </Form>
                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Log Name</th>
                                <th>Description</th>
                                <th>Subject </th>
                                <th>Event</th>
                                <th>Causer</th>
                                <th>Causer ID</th>
                                <th>Created</th>

                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map((tdata) => (
                                <tr key={tdata.id} className="border-top">

                                    <td>{tdata.log_name}</td>
                                    <td>{tdata.updated}</td>
                                    <td>{tdata.subject_type}</td>
                                    <td>{tdata.event}</td>
                                    <td>{tdata.causer_type}</td>
                                    <td>{tdata.causer_id}</td>
                                    <td>{formatDate(tdata.created_at)}</td>

                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                setSelectedItemId(tdata.id);
                                                setShowModal(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center mt-3">
                            <Button className="btn btn-primary me-2" onClick={handlePaginationPrev} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <Button className="btn btn-primary" onClick={handlePaginationNext} disabled={currentPage === totalPages}>
                                Next
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ) : (<p>Loading...</p>)}

            <Modal show={showModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove User Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this activity?</Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-outline-light" onClick={() => setShowModal(false)}>
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

export default ActivityLogList;
