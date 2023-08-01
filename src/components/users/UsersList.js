import {Button, Card, CardBody, CardSubtitle, CardTitle, Form, FormGroup, Input, Table} from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Alert from 'react-s-alert';
const BASE_URL = process.env.REACT_APP_API_URL;

const UsersList = () => {
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
            .get(`${BASE_URL}/users?page=${page}`)
            .then((response) => {
                setListData(response.data.data);
                setTotalPages(response.data.meta.last_page);
                setIsLoaded(true);
            })
            .catch((error) => console.log(error));
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
        axios.delete(`${BASE_URL}/users/${selectedItemId}`)
            .then(response => {
                setListData(listData.filter(item => item.id !== selectedItemId));
                setSelectedItemId(null);
                setShowModal(false);
                toast.success('User removed successfully');
                //NotificationManager.success('User removed successfully');
                Alert.success('User removed successfully!');
            })
            .catch(error => console.log(error));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredList = listData.filter((tdata) => {
        const searchTermLower = searchTerm.toLowerCase();
        const person = tdata.person; // Store tdata.person in a variable

        if (!person) {
            // If person does not exist, skip this item
            return false;
        }

        return (
            person.firstname.toLowerCase().includes(searchTermLower) ||
            person.lastname.toLowerCase().includes(searchTermLower) ||
            person.email.toLowerCase().includes(searchTermLower) ||
            tdata.username.toLowerCase().includes(searchTermLower)
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
                        <CardTitle tag="h5">Users Listing</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/new-user'} className="btn btn-primary">Add New User</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Overview of the users in the system
                        </CardSubtitle>

                        <Form>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="searchTerm"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search by email or username"
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
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredList.map((tdata) => (
                                <tr key={tdata.id} className="border-top">
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <div className="ms-3">
                                                <h6 className="mb-0">
                                                    {tdata.person.firstname} {tdata.person.lastname}
                                                </h6>
                                                <span className="text-muted">{tdata.person.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{tdata.person.email}</td>
                                    <td>{tdata.username}</td>
                                    <td>
                                        <Link
                                            to={`/edit-user/${tdata.id}`}
                                            className="btn btn-outline-primary"
                                        >
                                            Edit
                                        </Link>
                                    </td>
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
                    <Modal.Title>Remove User Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this account?</Modal.Body>
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

export default UsersList;
