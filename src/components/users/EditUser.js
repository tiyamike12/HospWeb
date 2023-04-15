import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {toast} from "react-toastify";
import Alert from "react-s-alert";
import validator from 'validator';

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
        phone_number: '',
        password: '',
        role_id: '',
        // errors: {}
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/users/${id}`)
            .then(response => {
                const userData = response.data;
                setUser({
                    name: userData.name,
                    email: userData.email,
                    phone_number: userData.phone_number,
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

        e.preventDefault();

        // const errors = {};
        //
        // if (validator.isEmpty(user.name)) {
        //     errors.name = 'User Name is required';
        // }
        //
        // if (validator.isEmpty(user.email)) {
        //     errors.email = 'Email is required';
        // }
        //
        // if (validator.isEmail(user.email)) {
        //     errors.email = 'Email must be a valid email';
        // }
        //
        // if (validator.isEmpty(user.password)) {
        //     errors.password = 'Password is required';
        // }
        //
        // if (validator.isEmpty(user.phone_number)) {
        //     errors.phone_number = 'Phone Number is required';
        // }
        //
        // if (validator.isNumeric(user.phone_number)) {
        //     errors.phone_number = 'Phone Number must be numeric';
        // }
        //
        // if (validator.isEmpty(user.role_id)) {
        //     errors.role_id = 'Role is required';
        // }
        //
        // if (Object.keys(errors).length) {
        //     setUser({ ...user, errors });
        //     return;
        // }

        setIsLoading(true)
        setDisable(true)

        try {
            await axios.patch(`${BASE_URL}/users/${id}`, user);
            Alert.success('User updated successfully!');
            navigate('/users');
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

    const getSelectClassName = name => {
        if (user.errors[name]) {
            return 'form-control is-invalid';
        } else if (user[name]) {
            return 'form-control is-valid';
        } else {
            return 'form-control';
        }
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
                        <Form onSubmit={handleSubmit} autoComplete="off">
                            <FormGroup>
                                <Label for="name">Username</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Username"
                                    type="text"
                                    value={user.name}
                                    // valid={!!user.name && !user.errors.name}
                                    // invalid={!!user.errors.name}
                                    onChange={handleInputChange}
                                />
                                {/*{user.errors.name && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.name}</span>}*/}
                            </FormGroup>
                            <FormGroup>
                                <Label for="phone_number">Phone</Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="Phone"
                                    type="number"
                                    value={user.phone_number}
                                    // valid={!!user.phone_number && !user.errors.phone_number}
                                    // invalid={!!user.errors.phone_number}
                                    onChange={handleInputChange}
                                />
                                {/*{user.errors.phone_number && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.phone_number}</span>}*/}
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    value={user.email}
                                    // valid={!!user.email && !user.errors.email}
                                    // invalid={!!user.errors.email}
                                    onChange={handleInputChange}
                                />
                                {/*{user.errors.email && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.email}</span>}*/}
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="password placeholder"
                                    type="password"
                                    value={user.password}
                                    // valid={!!user.password && !user.errors.password}
                                    // invalid={!!user.errors.password}
                                    onChange={handleInputChange}
                                />
                                {/*{user.errors.password && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.password}</span>}*/}

                            </FormGroup>
                            <FormGroup>
                                <Label for="role_id">Select</Label>
                                <select id="role_id" name="role_id"
                                        className="form-control"
                                        //className={getSelectClassName('role_id')}
                                        value={selectedItem} required={true}
                                       onChange={handleInputChange}>
                                    <option value="">Please select a value</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                {/*{user.errors.role_id && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.role_id}</span>}*/}
                            </FormGroup>

                            <Button type="submit" className="btn btn-success"  disabled={disable}>
                                Update User&emsp;
                                {isLoading && <span className="spinner-border spinner-border-sm me-1"></span> }
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Alert stack={{ limit: 5 }} />

        </Row>
    );
}

export default EditUser;
