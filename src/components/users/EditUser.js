import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody, CardTitle, Col, Form, FormGroup, FormText, Input, Label, Row } from "reactstrap";
import { toast } from "react-toastify";
import Alert from "react-s-alert";
import validator from 'validator';

const BASE_URL = process.env.REACT_APP_API_URL;

function EditUser() {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role_id: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role_id: '',
    });

    const { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/users/${id}`)
            .then(response => {
                const userData = response.data;
                setFormData({
                    name: userData.name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    password: '',
                    role_id: userData.role_id
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'User Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(formData.email)) {
            errors.email = 'Email must be a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        if (!formData.phone_number.trim()) {
            errors.phone_number = 'Phone Number is required';
        } else if (!validator.isNumeric(formData.phone_number)) {
            errors.phone_number = 'Phone Number must be numeric';
        }

        if (!formData.role_id) {
            errors.role_id = 'Role is required';
        }

        if (Object.keys(errors).length) {
            setFormData({ ...formData });
            return;
        }

        setIsLoading(true)
        setDisable(true)

        try {
            console.log("Form data updating " + JSON.stringify(formData));
            await axios.patch(`${BASE_URL}/users/${id}`, formData);
            Alert.success('User updated successfully!');
            navigate('/users');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setFormData({ ...formData, errors: error.response.data.errors });
                console.log(error.response.data.message);
                console.log("Errors happening here hehehe")
            } else {
                console.error(error)
            }
        }

        setIsLoading(false)
        setDisable(false)
    };

    const getSelectClassName = name => {
        if (formData.errors[name]) {
            return 'form-control is-invalid';
        } else if (formData[name]) {
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
                                    value={formData.name}
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
                                    value={formData.phone_number}
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
                                    value={formData.email}
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
                                    value={formData.password}
                                    // valid={!!user.password && !user.errors.password}
                                    // invalid={!!user.errors.password}
                                    onChange={handleInputChange}
                                />
                                {/*{user.errors.password && <span className="text-danger" style={{ marginTop: 10}}>{user.errors.password}</span>}*/}

                            </FormGroup>
                            <FormGroup>
                                <Label for="role_id">Role</Label>
                                <select
                                    id="role_id"
                                    name="role_id"
                                    value={formData.role_id}
                                    className='form-control'
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                                </select>
                                {/* {formData.errors.role_id && <div className="invalid-feedback">{formData.errors.role_id}</div>} */}
                            </FormGroup>

                            <Button type="submit" className="btn btn-success" disabled={disable}>
                                Update User&emsp;
                                {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
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
