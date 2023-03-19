import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
const BASE_URL = process.env.REACT_APP_API_URL;

function EditUser() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/users/${id}`)
            .then(response => {
                const userData = response.data;
                setUser({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role_id: userData.role.role_id
                });
                console.log(response.data)
                //setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, [id]);

    useEffect(() => {
        axios.get(`${BASE_URL}/roles`)
            .then(response => setRoles(response.data))
            .catch(error => console.log(error));
    }, []);

    const handleInputChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        setIsLoading(true)
        setDisable(true)
        e.preventDefault();
        try {
            await axios.patch(`${BASE_URL}/users/${id}`, user);
            toast.warn("User updated successfully")
            navigate('/starter');
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
                        Edit User
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="name">Username</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Username"
                                    type="text"
                                    value={user.name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="password placeholder"
                                    type="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="role_id">Select</Label>
                                <Input id="role_id" name="role_id" type="select" value={selectedItem}
                                       onChange={handleInputChange}>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </Input>
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update User&emsp;
                                {isLoading && <span className="spinner-border spinner-border-sm me-1"></span> }
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default EditUser;
